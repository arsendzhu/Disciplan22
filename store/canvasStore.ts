"use client";

import { create } from "zustand";

import { demoAssignments, demoCourses } from "@/lib/demo-data";

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

type CanvasStore = {
  courses: Course[];
  assignments: Assignment[];
  setCourses: (courses: Course[]) => void;
  setAssignments: (assignments: Assignment[]) => void;
};

export const useCanvasStore = create<CanvasStore>((set) => ({
  courses: demoCourses,
  assignments: demoAssignments,
  setCourses: (courses) => set({ courses }),
  setAssignments: (assignments) => set({ assignments }),
}));
