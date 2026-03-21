"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ThemeMode = "dark" | "light";
export type ThemePalette = "academia" | "carmine" | "coastal" | "forest";
export type TreeVariant = "orchard" | "blossom" | "aviary" | "moonlit";

type PreferencesStore = {
  mode: ThemeMode;
  palette: ThemePalette;
  treeVariant: TreeVariant;
  setMode: (mode: ThemeMode) => void;
  setPalette: (palette: ThemePalette) => void;
  setTreeVariant: (variant: TreeVariant) => void;
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      mode: "dark",
      palette: "academia",
      treeVariant: "orchard",
      setMode: (mode) => set({ mode }),
      setPalette: (palette) => set({ palette }),
      setTreeVariant: (treeVariant) => set({ treeVariant }),
    }),
    {
      name: "pulse-preferences",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
