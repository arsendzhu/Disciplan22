import type { Assignment, Course } from "@/store/canvasStore";

export type CanvasPullResult =
  | { ok: true; courses: Course[]; assignments: Assignment[] }
  | { ok: false; status: number; error: string };

/** Calls the Next.js sync route (same-origin). Pass a token for OAuth, or omit when the server uses CANVAS_COOKIE/CANVAS_CSRF. */
export async function pullCanvasData(token?: string | null): Promise<CanvasPullResult> {
  const headers: HeadersInit = {};
  if (token) {
    headers["x-canvas-token"] = token;
  }

  const res = await fetch("/api/canvas/sync", { headers });

  const payload = (await res.json().catch(() => ({}))) as {
    error?: string;
    courses?: Course[];
    assignments?: Assignment[];
  };

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: typeof payload.error === "string" ? payload.error : "Sync failed",
    };
  }

  return {
    ok: true,
    courses: Array.isArray(payload.courses) ? payload.courses : [],
    assignments: Array.isArray(payload.assignments) ? payload.assignments : [],
  };
}
