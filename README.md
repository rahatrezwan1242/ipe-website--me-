# IPE 25 — GPA/CGPA Calculator

Next.js 16 app with:

- Per-semester GPA calculator (marks / GPA / letter inputs stay in sync)
- Cumulative GPA across semesters (persisted in `localStorage`)
- Course detail modal (content summary + main texts)
- Chat advisor grounded in the full curriculum (Gemini, streaming)

## Local setup

```bash
cp .env.example .env.local
# paste your Gemini API key from https://aistudio.google.com/app/apikey
npm install
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Name | Required | Notes |
|---|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | yes | Get one from https://aistudio.google.com/app/apikey. Server-side only; never exposed to the browser. |

## Deploying to Netlify

1. Push this repo to GitHub.
2. On Netlify: **Add new site → Import from Git**, pick the repo, point base directory at `web/` if you keep the monorepo layout.
3. In **Site settings → Environment variables**, add `GOOGLE_GENERATIVE_AI_API_KEY`.
4. Deploy. Netlify auto-detects Next.js (no manual plugin install required).

## Project layout

```
app/
  api/chat/route.ts    streaming chat endpoint (Gemini)
  page.tsx             home page (server component)
  layout.tsx           root layout, dark theme
components/
  semester-calculator.tsx
  course-row.tsx
  course-detail-dialog.tsx
  cgpa-overview.tsx
  chat-panel.tsx
  ui/                  shadcn components
lib/
  curriculum.ts        typed wrapper around data/contents.json
  grades.ts            Percentage → GPA, letter mappings, computeSemesterGpa, computeCgpa
  storage.ts           useCgpaStore localStorage hook
  chat-context.ts      serialises the user's saved GPAs as chat context
  types.ts
data/
  contents.json        full curriculum (source of truth)
```

## Swapping the LLM

The chat route uses Gemini via `@ai-sdk/google`. To try another provider (OpenAI, Groq, etc.), install the corresponding `@ai-sdk/*` package and swap the `model` line in [app/api/chat/route.ts](app/api/chat/route.ts). The rest is provider-agnostic thanks to the AI SDK.

## Updating the curriculum

Edit [data/contents.json](data/contents.json). [lib/types.ts](lib/types.ts) defines the expected shape. Both the calculator and the chat context rebuild from this one file.
