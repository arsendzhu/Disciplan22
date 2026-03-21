"use client";

import { useNPCStore } from "@/store/npcStore";
import { usePreferencesStore } from "@/store/preferencesStore";

export function useGrowth() {
  const level = useNPCStore((state) => state.npcLevel);
  const currentStreak = useNPCStore((state) => state.streakDays);
  const treeVariant = usePreferencesStore((state) => state.treeVariant);

  return {
    level,
    idleMinutes: 84,
    goalProgress: 0.7,
    currentStreak,
    longestStreak: 12,
    treeVariant,
  };
}
