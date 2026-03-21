export type ScheduleEnergy = "high" | "medium" | "low" | "break";

export type SchedulerTask = {
  task_id: string;
  title: string;
  duration_minutes: number;
  energy_required: Exclude<ScheduleEnergy, "break">;
};

export type SchedulerParams = {
  peakWindow: "morning" | "afternoon" | "evening";
  bedtime: string;
  wakeTime: string;
  energyScore: number;
  moodScore: number;
  sleepHours: number;
  tasksList: SchedulerTask[];
  currentTime?: string;
};

function addMinutesToTime(start: string, minutes: number) {
  const [hours, mins] = start.split(":").map(Number);
  const total = hours * 60 + mins + minutes;
  const nextHours = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const nextMinutes = (total % 60).toString().padStart(2, "0");
  return `${nextHours}:${nextMinutes}`;
}

export async function generateDailySchedule(params: SchedulerParams) {
  let cursor = params.peakWindow === "morning" ? "09:00" : params.peakWindow === "afternoon" ? "12:00" : "17:00";

  const schedule = params.tasksList.map((task) => {
    const start = cursor;
    const end = addMinutesToTime(start, task.duration_minutes);
    cursor = addMinutesToTime(end, task.energy_required === "high" ? 20 : 10);

    return {
      task_id: task.task_id,
      title: task.title,
      start_time: start,
      end_time: end,
      energy_required: task.energy_required,
      technique: task.energy_required === "high" ? "deep_work" : "light_review",
      reasoning:
        params.peakWindow === "morning"
          ? "Scheduled during your strongest cognitive hours, well ahead of the deadline."
          : "Placed to protect your peak window while keeping later energy sustainable.",
    };
  });

  return {
    schedule,
    breaks: [
      {
        start_time: "12:00",
        duration_minutes: 30,
        type: "movement",
        suggestion: "Walk the Pioneer trail loop and come back before your next block starts.",
      },
    ],
    daily_note:
      "Protect the first high-focus block and let quick wins come after it so the day feels lighter, not heavier.",
    cognitive_curve: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      predicted_energy:
        params.peakWindow === "morning"
          ? hour >= 9 && hour <= 13
            ? 0.9
            : hour >= 7 && hour <= 18
              ? 0.56
              : 0.24
          : params.peakWindow === "afternoon"
            ? hour >= 12 && hour <= 16
              ? 0.9
              : hour >= 9 && hour <= 19
                ? 0.56
                : 0.24
            : hour >= 17 && hour <= 22
              ? 0.9
              : hour >= 11 && hour <= 23
                ? 0.56
                : 0.24,
    })),
  };
}
