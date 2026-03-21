# Pulse to DisciPlan Alignment

This document maps the current web app onto the `DisciPlan` repository structure without forcing a destructive rewrite.

## Why this exists

`DisciPlan` is intentionally small and split into a few clear areas:

- `engine/`
- `ui/`
- `data/`
- `assets/`

The app uses Next.js with route groups, shared UI primitives, and state stores. The compatibility layer adds top-level barrels that match the original repo mental model.

## Direct mapping

### Engine “brain”

- `engine/brain.ts`
- `lib/schedule-logic.ts`
- `lib/scheduler.ts`
- `lib/npcState.ts`

Scheduling and reasoning: cognitive zones, interleaving suggestions, matrix grouping, and daily schedule generation.

### Canvas

- `engine/canvas_api.ts` (barrel)
- `lib/canvas.ts` (OAuth + server session auth, Canvas REST)
- `app/api/canvas/*`

### Vision placeholder

- `engine/vision_module.ts`

Placeholder bridge for future webcam or fatigue scoring work.

### UI barrels

- `ui/app.ts` — barrel; real routes live under Next `app/`
- `ui/components/npc.ts` → `components/npc/*`
- `ui/components/sidebar.ts` → `components/navigation/*`

## Recommended strategy

1. Keep the top-level `engine/`, `ui/`, `data/`, and `assets/` folders.
2. Keep `app/`, `components/`, `hooks/`, `store/`, `lib/`, `constants/`, and `public/` as the implementation layer.
3. Treat top-level `engine/*` and `ui/*` TypeScript barrels as compatibility entry points.

## Practical result

You get both a modern web app and a repository shape aligned with the original `DisciPlan` layout.
