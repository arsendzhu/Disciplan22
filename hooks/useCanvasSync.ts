"use client";

import { useCallback, useEffect, useState } from "react";

import { pullCanvasData } from "@/lib/canvas-pull";
import { useCanvasStore } from "@/store/canvasStore";

/**
 * After localStorage rehydration, syncs Canvas data using OAuth (x-canvas-token) and/or server `.env` session cookies.
 */
export function useCanvasSync() {
  const accessToken = useCanvasStore((s) => s.accessToken);
  const setSyncState = useCanvasStore((s) => s.setSyncState);
  const setFromSync = useCanvasStore((s) => s.setFromSync);
  const clearCanvas = useCanvasStore((s) => s.clearCanvas);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useCanvasStore.persist.onFinishHydration(() => setHydrated(true));
    if (useCanvasStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  const sync = useCallback(async () => {
    setSyncState("loading", null);
    const token = useCanvasStore.getState().accessToken;
    const result = await pullCanvasData(token ?? undefined);

    if (!result.ok) {
      if (result.status === 401 && useCanvasStore.getState().accessToken) {
        clearCanvas();
      }
      setSyncState("error", result.error);
      return;
    }

    setFromSync({ courses: result.courses, assignments: result.assignments });
  }, [setSyncState, setFromSync, clearCanvas]);

  useEffect(() => {
    if (!hydrated) return;
    void sync();
  }, [hydrated, accessToken, sync]);

  return { sync, hydrated };
}
