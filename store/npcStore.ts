"use client";

import { create } from "zustand";

type NPCStore = {
  streakDays: number;
  npcLevel: number;
  tapMessageOpen: boolean;
  setTapMessageOpen: (open: boolean) => void;
  celebrateTaskCompletion: () => void;
};

export const useNPCStore = create<NPCStore>((set) => ({
  streakDays: 7,
  npcLevel: 7,
  tapMessageOpen: false,
  setTapMessageOpen: (open) => set({ tapMessageOpen: open }),
  celebrateTaskCompletion: () =>
    set((state) => ({
      streakDays: state.streakDays + 1,
      npcLevel: Math.min(state.npcLevel + 1, 16),
    })),
}));
