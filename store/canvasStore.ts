"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Course = {
  id: string;
  name: string;
  courseCode: string;
  professorName: string;
  color: string;
  dueThisWeek: number;
};

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  estimatedHours: number;
  difficulty: number;
  status: "pending" | "completed";
  source: "canvas" | "syllabus";
};

export type CanvasSyncStatus = "idle" | "loading" | "error";

type CanvasStore = {
  accessToken: string | null;
  courses: Course[];
  assignments: Assignment[];
  syncStatus: CanvasSyncStatus;
  syncError: string | null;
  setAccessToken: (token: string | null) => void;
  setCourses: (courses: Course[]) => void;
  setAssignments: (assignments: Assignment[]) => void;
  setSyncState: (status: CanvasSyncStatus, error?: string | null) => void;
  setFromSync: (payload: { courses: Course[]; assignments: Assignment[] }) => void;
  clearCanvas: () => void;
};

export const useCanvasStore = create<CanvasStore>()(
  persist(
    (set) => ({
      accessToken: null,
      courses: [],
      assignments: [],
      syncStatus: "idle",
      syncError: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setCourses: (courses) => set({ courses }),
      setAssignments: (assignments) => set({ assignments }),
      setSyncState: (status, error = null) => set({ syncStatus: status, syncError: error }),
      setFromSync: ({ courses, assignments }) =>
        set({ courses, assignments, syncStatus: "idle", syncError: null }),
      clearCanvas: () =>
        set({
          accessToken: null,
          courses: [],
          assignments: [],
          syncStatus: "idle",
          syncError: null,
        }),
    }),
    {
      name: "disciplan-canvas-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
