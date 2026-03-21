export type NPCState =
  | "thriving"
  | "happy"
  | "focused"
  | "neutral"
  | "tired"
  | "stressed"
  | "overwhelmed";

export type NPCUserData = {
  todayCheckin?: {
    mood_score?: number | null;
    energy_score?: number | null;
    sleep_hours?: number | null;
  };
  taskCompletionRate: number;
  overdueCount: number;
  streakDays: number;
  hoursUntilNextDeadline?: number | null;
};

export function calculateNPCState(userData: NPCUserData): NPCState {
  const mood = userData.todayCheckin?.mood_score ?? 3;
  const energy = userData.todayCheckin?.energy_score ?? 3;
  const sleep = userData.todayCheckin?.sleep_hours ?? 7;
  const completion = userData.taskCompletionRate;
  const overdue = userData.overdueCount;
  const streak = userData.streakDays;
  const deadline = userData.hoursUntilNextDeadline ?? 999;

  if (overdue >= 4 || (mood <= 1 && overdue >= 2)) return "overwhelmed";
  if (overdue >= 2 || (deadline < 24 && completion < 0.4)) return "stressed";
  if (sleep < 6 || energy <= 2) return "tired";
  if (mood >= 4 && energy >= 4 && completion >= 0.8 && streak >= 3) return "thriving";
  if (energy >= 4) return "focused";
  if (mood >= 3 && energy >= 3 && completion >= 0.6) return "happy";
  return "neutral";
}

export const npcStateCopy: Record<NPCState, { label: string; description: string }> = {
  thriving: {
    label: "Thriving",
    description: "You have momentum, breathing room, and visible progress.",
  },
  happy: {
    label: "Happy",
    description: "The day feels aligned and your work rhythm is holding.",
  },
  focused: {
    label: "Focused",
    description: "Your energy is high enough to handle the hard things first.",
  },
  neutral: {
    label: "Neutral",
    description: "Nothing is on fire, but the day could still drift either way.",
  },
  tired: {
    label: "Tired",
    description: "Low sleep or low energy means gentler wins matter more right now.",
  },
  stressed: {
    label: "Stressed",
    description: "You’re carrying deadline pressure and the room can feel it.",
  },
  overwhelmed: {
    label: "Overwhelmed",
    description: "Too many urgent things have stacked at the same time.",
  },
};
