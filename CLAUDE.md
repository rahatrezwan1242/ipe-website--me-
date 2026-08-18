# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Next.js 16 (App Router, Turbopack) site built by and for **IPE 25** — a batch of IUT's Department of Industrial & Production Engineering (IPE), not a general departmental portal. The site's primary audience is the batch itself: showcasing their talent and memories, and giving them tools to get help (GPA calculator, AI advisor). The brand wordmark is "IPE 25" throughout (hero, nav, footer, loading screen, metadata) — don't revert to the old generic "IUT IPE" placeholder. Homepage sections (`Memories`/`Timeline`/`Representatives`, see `components/home/`) are real, batch-shaped features, not filler — they're just empty until real content is added to [data/batch.ts](data/batch.ts) (the single source of truth for the batch's timeline events, class reps, and memory photos; don't hand-enter this data elsewhere, and don't invent placeholder names/events/photos on the owner's behalf — leave the arrays empty until they provide real content). Four pages: `/` (the batch homepage), `/curriculum` (the shared IPE curriculum reference — program-wide, not batch-specific), `/about`, and `/calculator` (semester GPA entry, CGPA overview, AI advisor). The repo lives in this directory (`web/`) and deploys to Netlify on every push to `main`. The legacy vanilla-HTML calculator at `../Project/` is unrelated and not part of this deploy.

## Quick Start

```bash
cp .env.example .env.local
# Paste a GEMINI_API_KEY from https://aistudio.google.com/app/apikey — it
# powers both the academic advisor chat and the department assistant.
npm install
npm run dev
```

Open http://localhost:3000/calculator. See [web/project.md](project.md) for a beginner-friendly walkthrough of the entire codebase.

## Commands

- `npm run dev` — Turbopack dev server with hot-reload (http://localhost:3000)
- `npm run build` — Production build; catches TypeScript errors
- `npm run start` — Run locally the same way Netlify will serve it
- `npm run lint` — Run eslint

**No test suite.** Build catches TS errors; lint runs `eslint`.

**Secrets:** `GEMINI_API_KEY` powers both the academic advisor chat and the department assistant — it's the only one required. `GROQ_API_KEY`/`CEREBRAS_API_KEY` are optional fallbacks for the department assistant only, tried in that order if Gemini fails. All go in `.env.local` (gitignored) locally; in Netlify, set them in Site settings → Environment variables. Never commit `.env.local` or any of these keys. See `.env.example` for where to get each one.

## Architecture

**Two persisted maps in localStorage**, both lazily hydrated by `useCgpaStore` in [lib/storage.ts](lib/storage.ts):
- `ipe-cgpa:history:v1` — semester-name → `{ gpa, credits, updatedAt }`. Drives the CGPA overview's "Load from memory" and the dropdown's saved-GPA badge.
- `ipe-cgpa:course-grades:v1` — semester-name → course-code → `{ marks?, gpa?, letter? }`. Auto-persisted on every keystroke once a semester is selected; hydrated when the user re-opens that semester.

`remove(semester)` clears both maps for that semester to keep them consistent.

**Curriculum is static JSON.** [data/contents.json](data/contents.json) is the source of truth (8 semesters, ~50 courses, content summaries, main texts). [lib/curriculum.ts](lib/curriculum.ts) just re-exports it as `Curriculum`. Don't duplicate this data — every consumer (chat system prompt, calculator dropdown, CGPA section, course detail dialog) reads from `curriculum`.

**Chat pipeline.** [components/chat-panel.tsx](components/chat-panel.tsx) is mounted globally in `app/layout.tsx`. It listens for the `ipe:open-chat` custom event (`OPEN_CHAT_EVENT` constant) so the nav "Ask AI" button and the CGPA "comeback strategy" button can pop it open without prop-drilling. On send, it builds a per-request `context` string via [lib/chat-context.ts](lib/chat-context.ts) (CGPA summary + per-semester GPAs + per-course grades) and sends it as a `body.context` field. **On `/curriculum`, context is suppressed** so the advisor stays general. The server route [app/api/chat/route.ts](app/api/chat/route.ts) appends `body.context` to the static `SYSTEM_PROMPT` and streams via `streamText` (Gemini). The system prompt has explicit "no sugar-coating, redirect any usage question to the info button" rules — keep that posture if you edit it.

**IPE 25 assistant** ("Department Assistant" internally in file/component names — not renamed, to avoid an import-touching churn — but its persona and KB are scoped to the batch, not a general department portal) — a second, separate chat, deliberately not merged with the one above (see below for why). [components/department-assistant.tsx](components/department-assistant.tsx) is mounted globally in `app/layout.tsx` as its own floating button, bottom-**left** (the academic advisor owns bottom-right — don't move either without checking for overlap). It calls [app/api/assistant/route.ts](app/api/assistant/route.ts), which injects the entire [data/knowledge-base.ts](data/knowledge-base.ts) `KB` object as JSON into the system instruction on every request (no vector DB — the dataset is small) and is instructed to answer *only* from it, refuse and point to `KB.contact` when the answer isn't there, and never treat an `isPlaceholder: true` record as a real answer. It answers about two things: IPE 25 itself (`KB.about`, `KB.timeline`, `KB.representatives` — the latter two derived from [data/batch.ts](data/batch.ts), the same arrays the homepage's Timeline/Representatives sections render, so real content only needs to be added once) and department reference facts still useful to the batch (`KB.faculty`/`courses`/`notices`/`labs`/`admission`/`contact`). `KB.courses` is derived from the real `curriculum` at import time, not hand-entered — same "don't duplicate curriculum data" rule as above; every hand-entered KB section (`faculty`, `notices`, `labs`, `admission`, `contact`, `about`) is placeholder data the owner still needs to fill in. The route tries providers in order — Gemini, then Groq, then Cerebras (all via the `ai` SDK already used by the other route; Groq/Cerebras go through `@ai-sdk/openai`'s `createOpenAI` pointed at their OpenAI-compatible endpoints) — falling back on failures that happen before streaming starts; a failure mid-stream surfaces as an error chunk instead, it can't cleanly retry once bytes are already flowing to the client. Rate-limited in-memory at 10 req/min/IP — per-instance only, see the TODO in the route about moving to Upstash/Supabase before this needs to hold up under real traffic.

*Why a second assistant instead of extending the first:* the academic advisor's persona ("no sugar-coating," opinionated career advice) and this one's ("never guess, cite the KB section, refuse if absent") actively contradict each other — one system prompt can't cleanly be both. If you're asked to unify them later, that tension is the first thing to resolve, not a merge to route around.

**Ambient layers** (mounted once in `app/layout.tsx`, not per page):
- `ParticleBackground` — Canvas 2D engineering-blueprint grid at z-index -10: a faint drafting grid with dimension-line/corner-bracket/datum-point marks drifting left-to-right. Theme-aware (reads `useTheme()` and re-renders once on toggle; under `prefers-reduced-motion` it paints once and never starts the rAF loop, rather than just zeroing velocity).
- `CustomCursor` — toggles `html.custom-cursor-active` (CSS in `globals.css`); fine-pointer only.
- `ClickSpill` — statistical-symbol spill on every pointerdown. **Currently disabled** via `const ENABLED = false` at the top of [components/click-spill.tsx](components/click-spill.tsx). Flip to `true` to re-enable; it short-circuits to a `null` render with no listeners attached.

**shadcn/ui is built on `@base-ui/react`, not Radix.** This matters: `Select.Item`'s `label` prop does NOT drive the trigger display in this version, so [components/semester-calculator.tsx](components/semester-calculator.tsx) bypasses `SelectValue` entirely and renders the trigger label from `semesterIndex` state directly. Don't "simplify" it back to `<SelectValue />` — the dropdown will fall back to showing the raw index.

**Fonts.** Titillium Web is bound to `--font-sans` via `next/font/google` in `app/layout.tsx`; the serif utility (`@utility font-serif` in `globals.css`) is reserved for hero numerals and section headers. Mono uses Geist Mono. Don't add other Google Fonts unless asked — keeps CLS predictable.

**Palette.** Sitewide tokens defined in `app/globals.css` — `:root` holds the light values, `.dark` overrides them (standard shadcn convention; `--color-*` in `@theme inline` is what turns these into `bg-background`/`text-foreground`/etc. Tailwind utilities). This is "Palette 2" — both the light and dark values are expressions of the same dusk mountain-lake photo the owner shared (navy/blue/dusty-rose/purple), replacing the earlier gold-accented "Palette 1" era. Dark is unchanged from before light mode existed: near-black-navy `#080b14` background, `#0e1420` cards, `#c98fa0` dusty-rose accent (buttons, focus rings, scrollbar, selection — the sitewide `--accent`), `#3d7dbf` blue for valid/success states (GPA pills, achieved-GPA badges), `#8f6ba8` purple for course code chips and secondary icons. Light's structural tones (background/card/border/text) come from a *second* reference photo the owner shared — a snowy lake, five swatches light-to-dark — not from lightening the dusk photo: `#f0ecdd` background, white cards, `#02122f` text, `#8ba3c5` muted/secondary fill, `#23354d` muted-foreground text, `#495b7d` border tint. The accent hues stay the dusk photo's rose/blue/purple, darkened/saturated for contrast rather than replaced, since they're a functional color-coding system (course types, buttons) that needs to read the same in both themes: `#a8496b` rose, `#2f6aa8` blue, `#6d4c85` purple. `/curriculum` scopes `--accent`/`--ring` to the purple via the `.curriculum-accent` wrapper class (see `app/curriculum/page.tsx`) so it reads as part of the same system without being identical to the sitewide rose. Course-type/metric identity colors (Theory/Lab/Major/Optional badges, achieved-GPA chips) use their own `--course-theory`/`--course-lab`/`--course-major`/`--course-misc` vars instead of `--accent` — they need to stay the same hue regardless of page, and `--accent` itself changes under `.curriculum-accent`. The homepage's own `HOME` palette (`lib/home-palette.ts`) reuses the same hues under legacy key names (`accentWarm`/`accentTeal`/`accentPurple`) but as `var(--home-*)` strings (also defined per-theme in `globals.css`), not hardcoded hex — components consume `HOME.x` as before, no hook needed. A hex-alpha suffix (`` `${HOME.accentTeal}2e` ``) doesn't work on a `var()` string; use `` `color-mix(in oklab, ${HOME.accentTeal} 18%, transparent)` `` instead, same as the rest of the codebase does for translucent variants of the `--course-*`/`--accent` tokens. Sections use `bg-[color-mix(in_oklab,var(--card)_55%,transparent)]` so the particle field shows through.

**Light/dark toggle.** `components/theme-provider.tsx` holds a `.dark`-class toggle (light is the class-less default) behind `useTheme()`, persisted to `localStorage` as `ipe-theme:v1`. `app/layout.tsx` server-renders `.dark` by default and runs a blocking inline `<script>` in `<head>` (before first paint, per `node_modules/next/dist/docs/.../preventing-flash-before-hydration.md`) that removes it when the stored preference is `"light"` — `<html>` needs `suppressHydrationWarning` because of this. `components/theme-toggle.tsx` is the sun/moon button; it's wired into both navs (`SiteNav` and the homepage's own `HomeNavbar`, since the homepage opts out of `SiteNav`). Don't use `useLayoutEffect` directly for anything theme-related — use the `useIsomorphicLayoutEffect` pattern in `theme-provider.tsx` (falls back to `useEffect` server-side), since App Router still executes "use client" bodies during SSR and bare `useLayoutEffect` warns there.

## Deployment

Netlify reads `netlify.toml` at the repo root (no `base` — repo root is already this `web/` directory). The `@netlify/plugin-nextjs` plugin is auto-injected. Pushing to `main` triggers a build; PRs get preview deploys. All API keys (`GEMINI_API_KEY`, `GROQ_API_KEY`, `CEREBRAS_API_KEY`) are set in Netlify env vars, never in the repo.

## Common Issues

**Page is blank / white screen:**
1. Check browser DevTools Console for errors (F12 → Console).
2. Verify `.env.local` has a valid `GEMINI_API_KEY` (powers both chats).
3. Hard refresh (Ctrl-Shift-R) to clear cache.

**Chat shows "An error occurred" with no other detail:**
- Both chat widgets swallow upstream errors into a generic client-side message by design (no leaking server error details) — the real reason is server-side. Check the dev-server terminal, or `.next/dev/logs/next-development.log`, for the actual thrown error.
- If it's a Gemini 404 on a pinned model name (e.g. `gemini-2.5-flash`) saying "no longer available to new users": Google cuts off pinned model versions for new API keys without much warning. Use a `-latest` alias instead of a pinned version — this already happened once building this feature.
- If it's `AI_APICallError: Incorrect API key provided`: the key in `.env.local` is wrong/revoked for that provider.
- If it's a 429 with `quotaId: GenerateRequestsPerDayPerProjectPerModel-FreeTier`: that model's free-tier daily quota is exhausted. **This is why both routes default to `gemini-flash-lite-latest`, not `gemini-flash-latest`** — the non-lite alias's free quota is a mere 20 requests/day, burned through in one afternoon of manual testing. The `-lite-latest` alias has separate, much higher quota. If you ever see this again, first check which model the error names — don't just assume it's the same one.
- Streamed replies cutting off mid-sentence with `finishReason: "other"` (not `"stop"`) on the non-lite model, near-simultaneously with the above: same root cause, not a separate bug — the model was already close to its daily cap.

**Changes not showing up:**
1. Check the dev-server terminal for Turbopack errors.
2. For server-component edits, sometimes a hard refresh is needed.
3. Favicons are aggressively cached — use incognito or DevTools → Application → Clear storage.

**Build fails locally:**
- Run `npm run build` to see the exact error. Usually a TypeScript type mismatch or an undefined import.

## Editing posture (project-specific)

- This is a personal student project, not a team codebase. Prefer minimal, in-place edits over new abstractions.
- The owner iterates fast on visual details. Don't add comments explaining what the code does — only ones that explain *why* something non-obvious exists (e.g. the `ENABLED` toggle, the `SelectValue` bypass).
- No automated tests, so: verify with `npm run build` before pushing. The owner often asks to "build and run locally" — `npm run dev` in the background and let them eyeball the change before commit.
- The user has explicitly authorized git pushes to `origin main` for this repo when they say so. Respect that scope; don't push unprompted.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
