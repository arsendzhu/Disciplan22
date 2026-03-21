# DisciPlan

DisciPlan now contains two aligned layers:

- a working Next.js web app for the modern Pulse experience
- the original lightweight Python prototype modules under `engine/*.py` and `ui/*.py`

The web app is the main product path. The Python files are preserved so the original repository structure and earlier experiments are not lost.

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

## Current status

Working now:

- responsive web app shell
- Home, Today, Grow, Discover, and Canvas demo routes
- working task creation flow
- multiple schedule layouts
- focus mode
- theme and palette switching
- Grow variants and visual customization
- seeded demo data for local preview

Still scaffolded or partial:

- live Canvas OAuth persistence
- production AI calls
- full backend persistence
- webcam / fatigue sensing

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

Legacy Python prototype values:

- `CANVAS_BASE_URL`
- `CANVAS_COOKIE`
- `CANVAS_CSRF`
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
| `engine/` | DisciPlan-compatible top-level engine barrels plus preserved Python prototype files |
| `ui/` | DisciPlan-compatible top-level UI barrels plus preserved Python prototype files |
| `data/` | Local syllabus and cache-oriented project data |
| `assets/` | Static repository assets |
| `docs/` | Migration and structure notes |

## DisciPlan alignment

Pulse was mapped into the original DisciPlan structure without flattening the app. The compatibility layer lives in:

- `engine/brain.ts`
- `engine/canvas_api.ts`
- `engine/vision_module.ts`
- `ui/app.ts`
- `ui/components/npc.ts`
- `ui/components/sidebar.ts`

See `docs/disciplan-alignment.md` for the full mapping.

## Legacy Python prototype

These files are still present and untouched as historical or experimental modules:

- `engine/brain.py`
- `engine/canvas_api.py`
- `engine/vision_module.py`
- `ui/app.py`
- `ui/components/npc.py`
- `ui/components/sidebar.py`

## Security

- Never commit real `.env`, `.env.local`, cookies, or API keys.
- If a secret is exposed, rotate it immediately.
