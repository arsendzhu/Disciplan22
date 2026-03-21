export {
  addMinutes,
  buildCognitiveCurve,
  describeDue,
  findScheduleSuggestions,
  getDueTone,
  getEnergyZone,
  getLayoutIntro,
  groupTasksForBoard,
  groupTasksForMatrix,
  shouldSuggestInterleaving,
} from "@/lib/schedule-logic";

export { calculateNPCState } from "@/lib/npcState";
export { generateDailySchedule, type SchedulerParams } from "@/lib/scheduler";

export const brainModuleNotes = {
  purpose:
    "DisciPlan-compatible engine barrel for scheduling, cognitive load, and NPC state logic.",
  sources: ["@/lib/schedule-logic", "@/lib/scheduler", "@/lib/npcState"],
};
