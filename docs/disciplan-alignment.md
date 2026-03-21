# Pulse to DisciPlan Alignment

This document maps the current Pulse web app onto the existing `DisciPlan` repository structure without forcing a destructive rewrite.

## Why this exists

`DisciPlan` is intentionally small and split into a few clear areas:

- `engine/`
- `ui/`
- `data/`
- `assets/`

Pulse is already a larger Next.js web app with route groups, shared UI primitives, and state stores. Instead of flattening that app into a worse shape, this compatibility layer preserves the working product and adds top-level barrels that match the destination repo's mental model.

## Direct mapping

### `engine/brain.py` in DisciPlan

Mapped here to:

- `engine/brain.ts`
- `lib/schedule-logic.ts`
- `lib/scheduler.ts`
- `lib/npcState.ts`

This is the scheduling and reasoning layer: cognitive zones, interleaving suggestions, matrix grouping, and daily schedule generation.

### `engine/canvas_api.py` in DisciPlan

Mapped here to:

- `engine/canvas_api.ts`
- `lib/canvas.ts`
- `app/api/canvas/*`

This keeps Canvas transport and parsing separate from UI.

### `engine/vision_module.py` in DisciPlan

Mapped here to:

- `engine/vision_module.ts`

This is still a placeholder bridge for future webcam or fatigue scoring work.

### `ui/app.py` in DisciPlan

Mapped here to:

- `ui/app.ts`
- `app/layout.tsx`
- `app/(tabs)/*`
- `app/(auth)/*`

The actual runtime entry for the web app stays in Next's `app/` directory, but `ui/app.ts` now acts as the repository-compatible barrel.

### `ui/components/npc.py` in DisciPlan

Mapped here to:

- `ui/components/npc.ts`
- `components/npc/*`

### `ui/components/sidebar.py` in DisciPlan

Mapped here to:

- `ui/components/sidebar.ts`
- `components/navigation/*`

## Recommended push strategy

If you want to migrate Pulse into `DisciPlan` without disturbing the already existing files:

1. Keep the top-level `engine/`, `ui/`, `data/`, and `assets/` folders.
2. Add the full Next.js app alongside them.
3. Preserve `app/`, `components/`, `hooks/`, `store/`, `lib/`, `constants/`, and `public/` as the real implementation layer.
4. Treat the top-level `engine/*` and `ui/*` files as stable compatibility entry points and documentation anchors.

## Practical result

You get both:

- a modern working web app with proper component boundaries
- a repository shape that still feels native to the original `DisciPlan` layout
