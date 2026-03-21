import {
  AlarmClockCheck,
  BookMarked,
  Brain,
  CalendarCheck2,
  ClipboardCheck,
  Flame,
  HeartHandshake,
  Layers3,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type ScheduleCategory =
  | "deep_work"
  | "study_review"
  | "assignment"
  | "exam"
  | "class"
  | "admin_life"
  | "self_care"
  | "project_milestone"
  | "focus_block";

export type EnergyLevel = "high" | "medium" | "low" | "flexible";
export type TaskPriority = "urgent_important" | "important" | "urgent" | "someday";
export type TaskStatus = "pending" | "in_progress" | "completed" | "skipped";
export type FocusTechnique =
  | "Ultradian 90min"
  | "Ultradian 80min"
  | "Ultradian 96min"
  | "Smart Pomodoro 3x"
  | "Time Block"
  | "Quick Wins"
  | "Review Sprint";

export type TaskLabel =
  | "@canvas"
  | "@group"
  | "@library"
  | "@laptop-only"
  | "@anywhere"
  | "@waiting"
  | "@review-later"
  | "@quick-win"
  | "@deadline-hard"
  | "@deadline-soft";

export type ScheduleLayout =
  | "energy"
  | "timeline"
  | "board"
  | "matrix"
  | "focus";

export const categoryMeta: Record<
  ScheduleCategory,
  {
    label: string;
    shortLabel: string;
    color: string;
    tint: string;
    icon: LucideIcon;
    energy: EnergyLevel;
    defaultTechnique: FocusTechnique;
    minDuration: number;
    maxConsecutive: number;
    schedulingRule: string;
  }
> = {
  deep_work: {
    label: "Deep Work",
    shortLabel: "Deep",
    color: "#C98B6A",
    tint: "rgba(201,139,106,0.14)",
    icon: Flame,
    energy: "high",
    defaultTechnique: "Ultradian 90min",
    minDuration: 60,
    maxConsecutive: 90,
    schedulingRule: "Peak window only. Always followed by a 15+ minute recovery break.",
  },
  study_review: {
    label: "Study & Review",
    shortLabel: "Study",
    color: "#8BA7D4",
    tint: "rgba(139,167,212,0.14)",
    icon: BookMarked,
    energy: "medium",
    defaultTechnique: "Review Sprint",
    minDuration: 45,
    maxConsecutive: 60,
    schedulingRule: "Secondary or peak window. Best when interleaved with another subject.",
  },
  assignment: {
    label: "Assignment",
    shortLabel: "Task",
    color: "#7EC8A4",
    tint: "rgba(126,200,164,0.14)",
    icon: ClipboardCheck,
    energy: "medium",
    defaultTechnique: "Time Block",
    minDuration: 30,
    maxConsecutive: 90,
    schedulingRule: "Any non-trough window. Strong default for Canvas-imported deliverables.",
  },
  exam: {
    label: "Exam / Test",
    shortLabel: "Exam",
    color: "#E8C97A",
    tint: "rgba(232,201,122,0.18)",
    icon: ShieldCheck,
    energy: "high",
    defaultTechnique: "Ultradian 96min",
    minDuration: 60,
    maxConsecutive: 90,
    schedulingRule: "Fixed high-stakes event. Surround with only low-load work.",
  },
  class: {
    label: "Class / Lecture",
    shortLabel: "Class",
    color: "#9B8EC4",
    tint: "rgba(155,142,196,0.16)",
    icon: CalendarCheck2,
    energy: "medium",
    defaultTechnique: "Time Block",
    minDuration: 50,
    maxConsecutive: 120,
    schedulingRule: "Locked anchor. AI builds around it, not through it.",
  },
  admin_life: {
    label: "Admin & Life",
    shortLabel: "Admin",
    color: "#9D9589",
    tint: "rgba(157,149,137,0.16)",
    icon: AlarmClockCheck,
    energy: "low",
    defaultTechnique: "Quick Wins",
    minDuration: 5,
    maxConsecutive: 45,
    schedulingRule: "Best batched in trough periods to reduce context switching.",
  },
  self_care: {
    label: "Self-Care & Recharge",
    shortLabel: "Rest",
    color: "#B8D4A8",
    tint: "rgba(184,212,168,0.18)",
    icon: HeartHandshake,
    energy: "low",
    defaultTechnique: "Time Block",
    minDuration: 15,
    maxConsecutive: 180,
    schedulingRule: "Protected restorative block. AI should never overwrite it.",
  },
  project_milestone: {
    label: "Project Milestone",
    shortLabel: "Project",
    color: "#D4537E",
    tint: "rgba(212,83,126,0.14)",
    icon: Layers3,
    energy: "high",
    defaultTechnique: "Ultradian 90min",
    minDuration: 60,
    maxConsecutive: 90,
    schedulingRule: "Break into sub-tasks and track visible progress inside the block.",
  },
  focus_block: {
    label: "Focus Block",
    shortLabel: "Focus",
    color: "#E8C97A",
    tint: "rgba(232,201,122,0.10)",
    icon: Brain,
    energy: "flexible",
    defaultTechnique: "Ultradian 90min",
    minDuration: 30,
    maxConsecutive: 120,
    schedulingRule: "User-defined protected focus session with a timer and reduced distraction.",
  },
};

export const priorityMeta: Record<
  TaskPriority,
  { label: string; color: string; quadrant: "do_now" | "schedule" | "batch" | "drop" }
> = {
  urgent_important: {
    label: "Do now",
    color: "#D4537E",
    quadrant: "do_now",
  },
  important: {
    label: "Schedule",
    color: "#E8C97A",
    quadrant: "schedule",
  },
  urgent: {
    label: "Batch",
    color: "#8BA7D4",
    quadrant: "batch",
  },
  someday: {
    label: "Drop",
    color: "#9D9589",
    quadrant: "drop",
  },
};

export const labelMeta: Record<TaskLabel, { color: string }> = {
  "@canvas": { color: "#8BA7D4" },
  "@group": { color: "#D4537E" },
  "@library": { color: "#E8C97A" },
  "@laptop-only": { color: "#C98B6A" },
  "@anywhere": { color: "#7EC8A4" },
  "@waiting": { color: "#9D9589" },
  "@review-later": { color: "#8BA7D4" },
  "@quick-win": { color: "#B8D4A8" },
  "@deadline-hard": { color: "#D4537E" },
  "@deadline-soft": { color: "#E8C97A" },
};

export const layoutMeta: Record<
  ScheduleLayout,
  { label: string; shortLabel: string; icon: LucideIcon }
> = {
  energy: { label: "Energy", shortLabel: "Energy", icon: Sparkles },
  timeline: { label: "Timeline", shortLabel: "Timeline", icon: CalendarCheck2 },
  board: { label: "Board", shortLabel: "Board", icon: Layers3 },
  matrix: { label: "Matrix", shortLabel: "Matrix", icon: ClipboardCheck },
  focus: { label: "Focus", shortLabel: "Focus", icon: Brain },
};

export const taskLabels = Object.keys(labelMeta) as TaskLabel[];
export const taskCategories = Object.keys(categoryMeta) as ScheduleCategory[];
