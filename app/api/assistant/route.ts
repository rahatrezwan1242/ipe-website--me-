import { convertToModelMessages, streamText, type LanguageModel, type UIMessage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

import { KB } from "@/data/knowledge-base";

// NOTE on runtime: the spec this route was built from asked for the Edge
// runtime, but this Next.js version has deprecated `export const runtime =
// "edge"` (see node_modules/next/dist/docs/.../route-segment-config/runtime.md)
// — it now warns you to remove the export entirely and use the nodejs default,
// which is also what the existing /api/chat route already does. So: no runtime
// export here, same as that route.

const MAX_MESSAGE_LENGTH = 1000;

/** Provider fallback order. Add/reorder entries here — nothing else needs to change. */
const PROVIDER_CONFIGS = [
  { name: "gemini", model: "gemini-flash-lite-latest" },
  { name: "groq", model: "llama-3.3-70b-versatile" },
  { name: "cerebras", model: "llama-3.3-70b" },
] as const;

type Provider = { name: string; model: LanguageModel };

/**
 * Builds the live provider list from whichever API keys are actually set.
 * Model ids are best-effort as of this writing — all three providers rotate
 * their hosted lineups (Gemini's `gemini-2.5-flash` was already dead for new
 * keys by the time this was tested, hence the `-latest` alias below instead
 * of a pinned version), so double check these against provider docs if one
 * starts erroring with a 404/model-not-found. Specifically the *lite* Gemini
 * variant, not plain `gemini-flash-latest`: the non-lite model's free tier
 * quota is only 20 requests/day (hit it during testing), while lite has
 * separate, much less restrictive quota and streams faster.
 */
function buildProviders(): Provider[] {
  const providers: Provider[] = [];

  if (process.env.GEMINI_API_KEY) {
    const gemini = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
    providers.push({ name: "gemini", model: gemini(PROVIDER_CONFIGS[0].model) });
  }
  if (process.env.GROQ_API_KEY) {
    const groq = createOpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
    providers.push({ name: "groq", model: groq(PROVIDER_CONFIGS[1].model) });
  }
  if (process.env.CEREBRAS_API_KEY) {
    const cerebras = createOpenAI({
      apiKey: process.env.CEREBRAS_API_KEY,
      baseURL: "https://api.cerebras.ai/v1",
    });
    providers.push({ name: "cerebras", model: cerebras(PROVIDER_CONFIGS[2].model) });
  }

  return providers;
}

const SYSTEM_INSTRUCTION = `You are the assistant for IPE 25 — a batch of the Department of Industrial & Production Engineering (IPE), Islamic University of Technology (IUT). You answer questions about IPE 25 itself (its story, timeline, class representatives) as well as department reference info (faculty, courses, notices, labs, admission, contact).

STRICT GROUNDING RULES — follow exactly, no exceptions:
1. Answer ONLY using the KNOWLEDGE BASE JSON below. Never invent, guess, or extrapolate names, dates, course codes, credit hours, room numbers, or contact info.
2. If the answer is not present in the knowledge base, say plainly that you don't have that information, and direct the user to the department office using the "contact" section's email/phone/office hours. Do not speculate.
3. Any record with "isPlaceholder": true has NOT been filled in yet — treat it as unpublished, not as a real answer, and point the user to "contact" instead. The "timeline" and "representatives" arrays aren't individually flagged this way — if either is empty, tell the user that hasn't been added to the site yet. The "courses" section is the only part that is always real data (it's the live curriculum), so it's never a placeholder.
4. When you do answer from the knowledge base, briefly note which section it came from, e.g. "(from: faculty)".
5. Reply in the same language the user wrote in — Bangla or English.
6. Format replies in Markdown: bullet lists for multiple faculty/courses/labs/timeline entries, **bold** for names/codes/dates that matter. Keep answers short and direct — this is a quick lookup tool, not an essay.

===== KNOWLEDGE BASE (JSON) =====
${JSON.stringify(KB)}
===== END KNOWLEDGE BASE =====`;

// In-memory fixed-window limiter: 10 requests/min per IP.
// TODO: this only limits requests within a single warm server instance's
// memory. Netlify can and will run multiple instances of this function
// concurrently, each with its own memory, so a client hitting different
// instances can exceed the intended limit. Move this to Upstash Redis or a
// Supabase table (a single shared counter) before this needs to hold up
// under real traffic or abuse.
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT) return false;
  bucket.count += 1;
  return true;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function lastUserMessageText(messages: UIMessage[]): string {
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") return "";
  return last.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return jsonError("Too many requests. Please wait a moment and try again.", 429);
  }

  let body: { messages?: UIMessage[] };
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonError("Missing 'messages' in request body.", 400);
  }

  const text = lastUserMessageText(body.messages);
  if (!text) {
    return jsonError("Message must be a non-empty string.", 400);
  }
  if (text.length > MAX_MESSAGE_LENGTH) {
    return jsonError(`Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`, 400);
  }

  const providers = buildProviders();
  if (providers.length === 0) {
    console.error("[assistant] No provider API keys configured (GEMINI_API_KEY / GROQ_API_KEY / CEREBRAS_API_KEY).");
    return jsonError("The assistant is not configured yet. Please try again later.", 500);
  }

  const modelMessages = await convertToModelMessages(body.messages);

  for (const provider of providers) {
    try {
      const result = streamText({
        model: provider.model,
        system: SYSTEM_INSTRUCTION,
        messages: modelMessages,
        temperature: 0.2,
        // Grounded lookup, not multi-step reasoning — Gemini 3's default
        // thinking budget was burning most of its output on "thinking" for
        // even trivial replies. 'low' is the lowest level this model actually
        // accepts ('minimal' 400s; thinkingBudget: 0 doesn't disable thinking
        // for Gemini 3.x the way it did for 2.5 — tested directly against the
        // API before landing on this). Ignored harmlessly by Groq/Cerebras,
        // which don't have a `google` provider-options namespace.
        providerOptions: {
          google: { thinkingConfig: { thinkingLevel: "low" } },
        },
      });

      // toUIMessageStreamResponse() returns synchronously — it doesn't await
      // the upstream call, so a failure that happens once bytes are already
      // streaming to the client (e.g. a key that's present but invalid, or a
      // mid-response provider outage) can't cleanly fall back to the next
      // provider anymore; it surfaces as an error chunk via onError below
      // instead. Only failures at construction/start time (caught by the
      // try/catch) actually advance to the next provider in the loop.
      return result.toUIMessageStreamResponse({
        onError: (error) => {
          console.error(`[assistant] ${provider.name} stream error:`, error);
          return "The assistant hit an error generating a response. Please try again.";
        },
      });
    } catch (err) {
      console.error(`[assistant] ${provider.name} failed to start:`, err);
      continue;
    }
  }

  return jsonError("All assistant providers are currently unavailable. Please try again later.", 503);
}
