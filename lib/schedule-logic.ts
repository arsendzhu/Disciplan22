import {
  categoryMeta,
  EnergyLevel,
  ScheduleCategory,
  ScheduleLayout,
} from "@/constants/schedule";
import { PulseTask } from "@/store/scheduleStore";
import { PeakEnergyWindow } from "@/store/userStore";

export type ScheduleSuggestion = {
  start: string;
  end: string;
  reason: string;
  zone: "peak" | "secondary" | "trough" | "recovery";
};

export function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function fromMinutes(value: number) {
  const hours = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function addMinutes(time: string, minutes: number) {
  return fromMinutes(toMinutes(time) + minutes);
}

function peakWindowMap(peakWindow: PeakEnergyWindow) {
  if (peakWindow === "morning") {
    return {
      peak: [8 * 60, 11 * 60],
      secondary: [14 * 60, 16 * 60],
      trough: [12 * 60 + 30, 14 * 60],
    };
  }

  if (peakWindow === "evening") {
    return {
      peak: [17 * 60, 21 * 60],
      secondary: [21 * 60, 23 * 60],
      trough: [13 * 60, 16 * 60],
    };
  }

  return {
    peak: [10 * 60, 13 * 60],
    secondary: [16 * 60, 18 * 60],
    trough: [13 * 60, 15 * 60],
  };
}

export function getEnergyZone(time: string, peakWindow: PeakEnergyWindow) {
  const minute = toMinutes(time);
  const windows = peakWindowMap(peakWindow);

  if (minute >= windows.peak[0] && minute < windows.peak[1]) return "peak";
  if (minute >= windows.secondary[0] && minute < windows.secondary[1]) return "secondary";
  if (minute >= windows.trough[0] && minute < windows.trough[1]) return "trough";
  return "recovery";
}

export function buildCognitiveCurve(peakWindow: PeakEnergyWindow) {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    predictedEnergy:
      getEnergyZone(`${hour.toString().padStart(2, "0")}:00`, peakWindow) === "peak"
        ? 0.95
        : getEnergyZone(`${hour.toString().padStart(2, "0")}:00`, peakWindow) === "secondary"
          ? 0.62
          : getEnergyZone(`${hour.toString().padStart(2, "0")}:00`, peakWindow) === "trough"
            ? 0.22
            : 0.38,
  }));
}

export function getDueTone(dueAt: string) {
  const diffHours = (new Date(dueAt).getTime() - Date.now()) / (1000 * 60 * 60);

  if (diffHours < 0) return "text-[#D4537E]";
  if (diffHours < 3) return "text-accent-tertiary";
  if (diffHours < 24) return "text-accent-primary";
  return "text-text-secondary";
}

export function describeDue(dueAt: string) {
  const due = new Date(dueAt);
  const hoursDiff = (due.getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursDiff < 0) return "Overdue";
  return `Due ${due.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}

export function groupTasksForBoard(tasks: PulseTask[]) {
  return {
    today: tasks.filter((task) => task.status === "pending"),
    inFocus: tasks.filter((task) => task.status === "in_progress"),
    done: tasks.filter((task) => task.status === "completed"),
    later: tasks.filter((task) => task.priority === "someday" || task.status === "skipped"),
  };
}

export function groupTasksForMatrix(tasks: PulseTask[]) {
  return {
    do_now: tasks.filter((task) => task.priority === "urgent_important"),
    schedule: tasks.filter((task) => task.priority === "important"),
    batch: tasks.filter((task) => task.priority === "urgent"),
    drop: tasks.filter((task) => task.priority === "someday"),
  };
}

export function getLayoutIntro(layout: ScheduleLayout) {
  switch (layout) {
    case "energy":
      return "Default view. Organizes the day around peak, secondary, and trough cognition zones.";
    case "timeline":
      return "Classic hourly planning for users who think in time blocks first.";
    case "board":
      return "Kanban flow for project-heavy days where status clarity matters most.";
    case "matrix":
      return "Urgency versus importance when the list feels too loud.";
    case "focus":
      return "Single-task fullscreen mode for high-pressure blocks and intentional timer work.";
  }
}

export function findScheduleSuggestions(params: {
  tasks: PulseTask[];
  category: ScheduleCategory;
  durationMinutes: number;
  peakWindow: PeakEnergyWindow;
  energyLevel: EnergyLevel;
}): ScheduleSuggestion[] {
  const busyRanges = params.tasks.map((task) => [toMinutes(task.scheduledTime), toMinutes(task.endTime)]);
  const suggestions: ScheduleSuggestion[] = [];
  const step = 15;
  const earliest = 8 * 60;
  const latest = 22 * 60;

  for (let start = earliest; start <= latest - params.durationMinutes; start += step) {
    const end = start + params.durationMinutes;
    const overlapping = busyRanges.some(([busyStart, busyEnd]) => !(end <= busyStart || start >= busyEnd));
    if (overlapping) continue;

    const zone = getEnergyZone(fromMinutes(start), params.peakWindow);
    const score =
      params.energyLevel === "high"
        ? zone === "peak"
          ? 3
          : zone === "secondary"
            ? 2
            : 0
        : params.energyLevel === "medium"
          ? zone === "peak"
            ? 3
            : zone === "secondary"
              ? 3
              : 1
          : zone === "trough"
            ? 3
            : 2;

    if (score < 2) continue;

    suggestions.push({
      start: fromMinutes(start),
      end: fromMinutes(end),
      zone,
      reason:
        zone === "peak"
          ? `Scheduled here because ${categoryMeta[params.category].label} belongs in your strongest window.`
          : zone === "secondary"
            ? `Scheduled here because this is a solid secondary window without fighting your rhythm.`
            : `Scheduled here because low-load work fits your trough better than deep work would.`,
    });
  }

  return suggestions.slice(0, 3);
}

export function shouldSuggestInterleaving(tasks: PulseTask[]) {
  const pending = tasks.filter((task) => task.status !== "completed");
  for (let index = 0; index < pending.length - 1; index += 1) {
    const current = pending[index];
    const next = pending[index + 1];
    if (
      current.courseName &&
      next.courseName &&
      current.courseName === next.courseName &&
      current.durationMinutes + next.durationMinutes >= 120
    ) {
      return {
        courseName: current.courseName,
        minutes: current.durationMinutes + next.durationMinutes,
      };
    }
  }

  return null;
}
