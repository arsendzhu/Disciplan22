"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  categoryMeta,
  EnergyLevel,
  FocusTechnique,
  ScheduleCategory,
  ScheduleLayout,
  TaskLabel,
  TaskPriority,
  TaskStatus,
} from "@/constants/schedule";
import { demoTasks } from "@/lib/demo-data";

export type PulseTask = {
  id: string;
  title: string;
  courseName?: string;
  scheduledTime: string;
  endTime: string;
  durationMinutes: number;
  energyRequired: EnergyLevel;
  category: ScheduleCategory;
  priority: TaskPriority;
  dueAt: string;
  labels: TaskLabel[];
  focusTechnique: FocusTechnique;
  implementationIntention?: string;
  notes?: string;
  progress?: number;
  status: TaskStatus;
};

type ScheduleStore = {
  tasks: PulseTask[];
  preferredLayout: ScheduleLayout;
  activeFocusTaskId: string | null;
  focusMinutesRemaining: number;
  focusIsRunning: boolean;
  addTask: (task: PulseTask) => void;
  completeTask: (id: string) => void;
  skipTask: (id: string) => void;
  startTask: (id: string) => void;
  rescheduleTask: (id: string, scheduledTime: string, endTime: string) => void;
  setPreferredLayout: (layout: ScheduleLayout) => void;
  startFocusSession: (taskId: string, minutes?: number) => void;
  pauseFocusSession: () => void;
  tickFocusSession: () => void;
  stopFocusSession: () => void;
  createTaskFromInput: (input: {
    title: string;
    category: ScheduleCategory;
    courseName?: string;
    durationMinutes: number;
    priority: TaskPriority;
    labels: TaskLabel[];
    dueAt?: string;
    scheduledTime: string;
    endTime: string;
    implementationIntention?: string;
  }) => PulseTask;
  resetDemo: () => void;
};

function buildTaskId() {
  return `task-${Math.random().toString(36).slice(2, 10)}`;
}

function hydrateDemoTasks(): PulseTask[] {
  return demoTasks.map((task) => ({
    ...task,
    labels: [...task.labels],
  }));
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set) => ({
      tasks: hydrateDemoTasks(),
      preferredLayout: "energy",
      activeFocusTaskId: null,
      focusMinutesRemaining: 90,
      focusIsRunning: false,
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      completeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status: "completed" } : task,
          ),
          activeFocusTaskId: state.activeFocusTaskId === id ? null : state.activeFocusTaskId,
          focusIsRunning: state.activeFocusTaskId === id ? false : state.focusIsRunning,
        })),
      skipTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status: "skipped" } : task,
          ),
        })),
      startTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, status: "in_progress" }
              : task.status === "in_progress"
                ? { ...task, status: "pending" }
                : task,
          ),
        })),
      rescheduleTask: (id, scheduledTime, endTime) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, scheduledTime, endTime } : task,
          ),
        })),
      setPreferredLayout: (layout) => set({ preferredLayout: layout }),
      startFocusSession: (taskId, minutes = 90) =>
        set((state) => ({
          activeFocusTaskId: taskId,
          focusMinutesRemaining: minutes,
          focusIsRunning: true,
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, status: "in_progress" } : task,
          ),
        })),
      pauseFocusSession: () => set({ focusIsRunning: false }),
      tickFocusSession: () =>
        set((state) => ({
          focusMinutesRemaining:
            state.focusMinutesRemaining > 0 ? state.focusMinutesRemaining - 1 : 0,
          focusIsRunning: state.focusMinutesRemaining > 1 ? state.focusIsRunning : false,
        })),
      stopFocusSession: () =>
        set({
          activeFocusTaskId: null,
          focusMinutesRemaining: 90,
          focusIsRunning: false,
        }),
      createTaskFromInput: (input) => {
        const category = categoryMeta[input.category];
        const task: PulseTask = {
          id: buildTaskId(),
          title: input.title,
          courseName: input.courseName,
          scheduledTime: input.scheduledTime,
          endTime: input.endTime,
          durationMinutes: input.durationMinutes,
          energyRequired: category.energy,
          category: input.category,
          priority: input.priority,
          dueAt:
            input.dueAt ??
            new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
          labels: input.labels,
          focusTechnique: category.defaultTechnique,
          implementationIntention: input.implementationIntention,
          notes: category.schedulingRule,
          progress: input.category === "project_milestone" ? 0.15 : undefined,
          status: "pending",
        };

        set((state) => ({ tasks: [...state.tasks, task] }));
        return task;
      },
      resetDemo: () =>
        set({
          tasks: hydrateDemoTasks(),
          preferredLayout: "energy",
          activeFocusTaskId: null,
          focusMinutesRemaining: 90,
          focusIsRunning: false,
        }),
    }),
    {
      name: "pulse-schedule-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
