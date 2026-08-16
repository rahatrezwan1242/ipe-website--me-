import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

import { curriculum } from '@/lib/curriculum';

// Build curriculum context
function buildCurriculumContext(): string {
  const lines: string[] = [
    `Program: ${curriculum.program}`,
    `Total core credits: ${curriculum.total_core_credits}; optional: ${curriculum.optional_credits}`,
    '',
    "Semesters and courses (code — title [credits]; '•' bullets list course content; '📖' lines list main texts/references):",
  ];

  for (const s of curriculum.semesters) {
    lines.push(`\n## ${s.name} — ${s.total_credits} credits`);
    for (const c of s.courses) {
      const tags: string[] = [];
      if (c.course_type) tags.push(c.course_type);
      if (c.isMajor) tags.push('Major');
      const tagStr = tags.length ? ` (${tags.join(', ')})` : '';

      lines.push(`- ${c.code} — ${c.title} [${c.credits} cr]${tagStr}`);
      for (const item of c.content_summary) lines.push(`    • ${item}`);
      for (const text of c.main_texts) lines.push(`    📖 ${text}`);
    }
  }

  return lines.join('\n');
}

const CURRICULUM_CONTEXT = buildCurriculumContext();

const SYSTEM_PROMPT = `You are an academic advisor for an undergraduate student at the Islamic University of Technology (IUT), Department of Industrial & Production Engineering (IPE). You have full knowledge of their curriculum (below) and should help with:\n\n- Course topics, prerequisites, and what to prioritise\n- GPA/CGPA planning and realistic targets given their current standing\n- Connections between courses, study strategies, useful tools (AutoCAD/SolidWorks, MATLAB, Python, Minitab, simulation software like Arena)\n- Career paths (manufacturing, operations, supply chain, quality, analytics, research) relevant to their background\n\nNo sugar-coating: give direct, realistic feedback. Redirect any question about how to use this website/calculator to the "How it works" info button instead of answering it yourself.\n\nFormatting: reply in Markdown — use short paragraphs, bullet/numbered lists for multi-part answers, and **bold** for the one or two things that matter most. Skip headers for short answers; use them only when a reply has multiple distinct sections. Keep it tight — a focused answer beats a long one; only go long when the question genuinely needs it.\n\n===== CURRICULUM =====\n${CURRICULUM_CONTEXT}\n===== END CURRICULUM =====`;

// gemini-2.5-flash (a pinned version) was already dead for new keys by the
// time this was tested — 404 "no longer available to new users" — so this
// uses the `-latest` alias instead, which stays current automatically.
// Specifically the *lite* variant: gemini-flash-latest (currently
// gemini-3.7-flash) hit its free-tier quota — literally 20 requests/day —
// within one afternoon of testing. gemini-flash-lite-latest (currently
// gemini-3.5-flash-lite) has separate, much less restrictive quota, streams
// faster, and doesn't need thinkingLevel tuning since it barely "thinks" by
// default. See app/api/assistant/route.ts for the same choice.
const MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages: UIMessage[]; context?: string };

    if (!body?.messages) {
      return new Response(JSON.stringify({ error: "Missing 'messages' in request body" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('Missing GEMINI_API_KEY');
      return new Response(JSON.stringify({ error: 'Server is not configured with an API key.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const gemini = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

    const system = body.context
      ? `${SYSTEM_PROMPT}\n\n===== STUDENT'S CURRENT GPA STATE =====\n${body.context}\n===== END =====`
      : SYSTEM_PROMPT;

    const result = streamText({
      model: gemini(MODEL),
      system,
      messages: await convertToModelMessages(body.messages),
      // This is a chat, not a multi-step reasoning task — Gemini 3's default
      // thinking budget was burning ~90% of output tokens on "thinking" for
      // even trivial replies, which just adds latency here for no benefit.
      // 'low' is the lowest level this model actually accepts — 'minimal'
      // 400s ("not supported for this model"), and thinkingBudget: 0 doesn't
      // disable thinking for Gemini 3.x the way it did for 2.5 (confirmed by
      // testing directly against the API before landing on this).
      providerOptions: {
        google: { thinkingConfig: { thinkingLevel: 'low' } },
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error('Chat route error:', err);
    return new Response(JSON.stringify({ error: 'Failed to generate a response. Please try again.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
