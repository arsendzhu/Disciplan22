"use client";

import { useMemo } from "react";

import { calculateNPCState } from "@/lib/npcState";
import { useNPCStore } from "@/store/npcStore";
import { useScheduleStore } from "@/store/scheduleStore";
import { useUserStore } from "@/store/userStore";

export function useNPCState() {
  const profile = useUserStore((state) => state.profile);
  const tasks = useScheduleStore((state) => state.tasks);
  const streakDays = useNPCStore((state) => state.streakDays);

  return useMemo(() => {
    const todaysTasks = tasks.filter((task) => task.category !== "self_care");
    const completed = todaysTasks.filter((task) => task.status === "completed").length;
    const overdue = todaysTasks.filter((task) => task.status === "skipped").length + 2;
    const currentState = calculateNPCState({
      todayCheckin: {
        mood_score: profile.moodScore,
        energy_score: profile.energyScore,
        sleep_hours: profile.sleepHours,
      },
      taskCompletionRate: todaysTasks.length ? completed / todaysTasks.length : 0,
      overdueCount: overdue,
      streakDays,
      hoursUntilNextDeadline: 6,
    });

    return {
      currentState,
      streakDays,
      completionRate: todaysTasks.length ? completed / todaysTasks.length : 0,
      overdueCount: overdue,
    };
  }, [profile.energyScore, profile.moodScore, profile.sleepHours, streakDays, tasks]);
}
