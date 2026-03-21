# DisciPlan

DisciPlan is a Next.js web app for planning around Canvas coursework and schedules.

## Main app stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Zustand
- React Query
- Supabase-ready API scaffolding

## Run the web app

1. Install Node.js 20+ and npm.
2. Copy the env template:

```bash
cp .env.example .env.local
```

3. Install dependencies:

```bash
npm install
```

4. Start the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Useful web commands

```bash
npm run dev
npm run typecheck
npm run build
```

## Main routes

- `/` → Home
- `/today` → working schedule system with multiple layouts
- `/canvas`
- `/grow`
- `/discover`
- `/welcome`
- `/connect-canvas`
- `/setup-profile`

## Canvas data

The **backend is Node/TypeScript** (Next.js API routes under `app/api/`). There is no Python runtime in this repo.

Canvas access works in two ways (both implemented in `lib/canvas.ts`):

1. **Server session (`.env`)** — Set `CANVAS_COOKIE` and `CANVAS_CSRF` (and usually `CANVAS_BASE_URL`) on the server. API routes call Canvas with the same headers the old prototype used. Restart the dev server after changing these. Refresh cookies in `.env` when Canvas expires your session.
2. **OAuth** — Optional: `CANVAS_CLIENT_ID`, `CANVAS_CLIENT_SECRET`, `NEXT_PUBLIC_CANVAS_REDIRECT_URI`, and “Connect with OAuth” on the Canvas page. If the client sends `x-canvas-token`, that Bearer token is used instead of the session cookies.

## Environment variables

Browser-safe or app-level config:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_CANVAS_REDIRECT_URI`

Server-side keys:

- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `PERPLEXITY_API_KEY`
- `CANVAS_CLIENT_ID`
- `CANVAS_CLIENT_SECRET`
- `GOOGLE_CALENDAR_CLIENT_ID`

Canvas (server):

- `CANVAS_BASE_URL` — Canvas instance origin (no trailing slash), e.g. `https://csueastbay.instructure.com`
- `CANVAS_COOKIE` — Full `Cookie` header value from your logged-in browser session
- `CANVAS_CSRF` — `_csrf_token` (or equivalent) for Canvas API requests

Other:

- `ELEVENLABS_API_KEY`

## Repository layout

| Folder | Purpose |
|--------|---------|
| `app/` | Next.js routes and API handlers |
| `components/` | Shared web UI, NPC, schedule, grow, and navigation components |
| `hooks/` | UI-facing derived logic hooks |
| `store/` | Zustand stores |
| `lib/` | Core app logic, API wrappers, schedule engine, utilities |
| `constants/` | Theme and scheduling taxonomy |
| `engine/` | DisciPlan-compatible engine barrels (`*.ts`) |
| `ui/` | DisciPlan-compatible UI barrels (`*.ts`) |
| `data/` | Local syllabus and cache-oriented project data |
| `assets/` | Static repository assets |
| `docs/` | Migration and structure notes |

## DisciPlan alignment

The compatibility layer lives in:

- `engine/brain.ts`
- `engine/canvas_api.ts`
- `engine/vision_module.ts`
- `ui/app.ts`
- `ui/components/npc.ts`
- `ui/components/sidebar.ts`

See `docs/disciplan-alignment.md` for the full mapping.

## Security

- Never commit real `.env`, `.env.local`, cookies, or API keys.
- If a secret is exposed, rotate it immediately.
