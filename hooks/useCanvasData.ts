"use client";

import { useMemo } from "react";

import { useCanvasStore } from "@/store/canvasStore";

export function useCanvasData() {
  const courses = useCanvasStore((state) => state.courses);
  const assignments = useCanvasStore((state) => state.assignments);

  return useMemo(
    () => ({
      courses,
      assignments,
      dangerWeek: {
        label: "April 14-18",
        summary:
          "3 exams + 2 major projects due. Start the CS lab report this weekend to avoid falling behind.",
      },
    }),
    [assignments, courses],
  );
}
