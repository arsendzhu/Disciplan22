"use client";

import { useMemo } from "react";

import { useCanvasSyncContext } from "@/components/providers/CanvasSyncProvider";
import { useCanvasStore } from "@/store/canvasStore";

export function useCanvasData() {
  const courses = useCanvasStore((state) => state.courses);
  const assignments = useCanvasStore((state) => state.assignments);
  const accessToken = useCanvasStore((state) => state.accessToken);
  const syncStatus = useCanvasStore((state) => state.syncStatus);
  const syncError = useCanvasStore((state) => state.syncError);
  const { sync, hydrated } = useCanvasSyncContext();

  const dangerWeek = useMemo(() => {
    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 86400000);
    const soon = assignments.filter((a) => {
      const d = new Date(a.dueDate);
      return d >= now && d <= weekEnd;
    });

    return {
      label: soon.length > 0 ? "Next 7 days" : "Nothing due this week",
      summary:
        soon.length > 0
          ? `${soon.length} assignment${soon.length === 1 ? "" : "s"} due in the next week.`
          : assignments.length > 0
            ? "No deadlines in the next seven days."
            : "No upcoming dated assignments in Canvas. Use Sync after configuring .env or OAuth.",
    };
  }, [assignments]);

  return {
    courses,
    assignments,
    dangerWeek,
    accessToken,
    syncStatus,
    syncError,
    sync,
    hydrated,
  };
}
