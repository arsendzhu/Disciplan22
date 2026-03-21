"use client";

import { useMemo } from "react";

import { useScheduleStore } from "@/store/scheduleStore";

export function useSchedule() {
  const tasks = useScheduleStore((state) => state.tasks);
  const preferredLayout = useScheduleStore((state) => state.preferredLayout);
  const activeFocusTaskId = useScheduleStore((state) => state.activeFocusTaskId);
  const focusMinutesRemaining = useScheduleStore((state) => state.focusMinutesRemaining);
  const focusIsRunning = useScheduleStore((state) => state.focusIsRunning);

  return useMemo(() => {
    const taskItems = tasks.filter((task) => task.category !== "self_care");
    const focusMinutes = taskItems
      .filter((task) => task.energyRequired === "high" && task.status !== "skipped")
      .reduce((total, task) => total + task.durationMinutes, 0);

    return {
      tasks,
      preferredLayout,
      stats: {
        taskCount: taskItems.length,
        focusHours: Math.round((focusMinutes / 60) * 10) / 10,
        sleepHours: 5.8,
      },
      nextTask: tasks.find((task) => task.status === "pending") ?? null,
      completedCount: taskItems.filter((task) => task.status === "completed").length,
      activeFocusTask:
        tasks.find((task) => task.id === activeFocusTaskId) ?? null,
      focusMinutesRemaining,
      focusIsRunning,
    };
  }, [activeFocusTaskId, focusIsRunning, focusMinutesRemaining, preferredLayout, tasks]);
}
