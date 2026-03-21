"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type PeakEnergyWindow = "morning" | "afternoon" | "evening";

export type UserProfile = {
  displayName: string;
  email: string;
  canvasConnected: boolean;
  peakEnergyWindow: PeakEnergyWindow;
  sleepTargetHours: number;
  sleepBedtime: string;
  wakeTime: string;
  timezone: string;
  onboardingComplete: boolean;
  moodScore: number;
  energyScore: number;
  sleepHours: number;
};

type UserStore = {
  authStatus: "signedOut" | "signedIn";
  profile: UserProfile;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  markCanvasConnected: (connected: boolean) => void;
  submitCheckin: (moodScore: number, energyScore: number) => void;
};

const defaultProfile: UserProfile = {
  displayName: "Alex",
  email: "",
  canvasConnected: false,
  peakEnergyWindow: "morning",
  sleepTargetHours: 7.5,
  sleepBedtime: "23:00",
  wakeTime: "07:00",
  timezone: "America/Los_Angeles",
  onboardingComplete: true,
  moodScore: 2,
  energyScore: 3,
  sleepHours: 5.8,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      authStatus: "signedOut",
      profile: defaultProfile,
      signInWithEmail: async (email) => {
        set((state) => ({
          authStatus: "signedIn",
          profile: { ...state.profile, email, onboardingComplete: true },
        }));
      },
      signOut: () => {
        set({
          authStatus: "signedOut",
          profile: defaultProfile,
        });
      },
      updateProfile: (patch) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...patch,
          },
        })),
      completeOnboarding: () =>
        set((state) => ({
          profile: {
            ...state.profile,
            onboardingComplete: true,
          },
        })),
      markCanvasConnected: (connected) =>
        set((state) => ({
          profile: {
            ...state.profile,
            canvasConnected: connected,
          },
        })),
      submitCheckin: (moodScore, energyScore) =>
        set((state) => ({
          profile: {
            ...state.profile,
            moodScore,
            energyScore,
          },
        })),
    }),
    {
      name: "pulse-user-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ authStatus: state.authStatus, profile: state.profile }),
    },
  ),
);
