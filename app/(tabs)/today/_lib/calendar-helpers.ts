import { categoryMeta } from "@/constants/schedule";
import { toMinutes } from "@/lib/schedule-logic";
import type { Assignment } from "@/store/canvasStore";
import type { PulseTask } from "@/store/scheduleStore";

export const HOURS = Array.from({ length: 24 }, (_, index) => index);
export const PIXELS_PER_MINUTE = 1;
export const START_MINUTE = 0;
export const HALF_HOUR_MARKS = Array.from({ length: 49 }, (_, index) => index * 30);
export const EXAM_ACCENT = "#D4537E";
export const WORK_ACCENT = "#8BA7D4";

export type CalendarRange = "day" | "3days" | "7days" | "month";

export type CalendarDayState = {
  hasAssignments: boolean;
  hasExams: boolean;
  hasScheduledTasks: boolean;
  itemCount: number;
};

export type CalendarDeadlineItem = {
  id: string;
  title: string;
  subtitle: string;
  metaLabel: string;
  color: string;
  backgroundColor: string;
  dayKey: string;
  isExam: boolean;
  sortValue: number;
  source: "task" | "assignment";
};

export type PositionedTask = {
  task: PulseTask;
  height: number;
  laneCount: number;
  laneIndex: number;
  top: number;
};

export const RANGE_META: Array<{ label: string; value: CalendarRange }> = [
  { label: "Day", value: "day" },
  { label: "3 Days", value: "3days" },
  { label: "7 Days", value: "7days" },
  { label: "Month", value: "month" },
];

export const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const dayNumberFormatter = new Intl.DateTimeFormat("en-US", { day: "numeric" });
const dayLabelFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});
const rangeLabelFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const monthLabelFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});
export const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

export function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

export function startOfMonth(date: Date) {
  const value = startOfDay(date);
  value.setDate(1);
  return value;
}

export function addDays(date: Date, days: number) {
  const value = startOfDay(date);
  value.setDate(value.getDate() + days);
  return value;
}

export function addMonths(date: Date, months: number) {
  const value = startOfMonth(date);
  value.setMonth(value.getMonth() + months);
  return value;
}

export function getDateKey(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}`;
}

export function isSameDay(left: Date, right: Date) {
  return getDateKey(left) === getDateKey(right);
}

export function buildMonthDays(anchorDate: Date) {
  const monthStart = startOfMonth(anchorDate);
  const calendarStart = addDays(monthStart, -monthStart.getDay());
  return Array.from({ length: 42 }, (_, index) => addDays(calendarStart, index));
}

export function getRangeTitle(range: CalendarRange, anchorDate: Date, days: Date[]) {
  if (range === "month") {
    return monthLabelFormatter.format(anchorDate);
  }
  if (range === "day") {
    return dayLabelFormatter.format(anchorDate);
  }
  const start = days[0];
  const end = days[days.length - 1];
  return `${rangeLabelFormatter.format(start)} - ${rangeLabelFormatter.format(end)}`;
}

export function formatWeekdayShort(day: Date) {
  return weekdayFormatter.format(day);
}

export function formatDayNumber(day: Date) {
  return dayNumberFormatter.format(day);
}

export function isExamLike(title: string) {
  return /\b(midterm|final|exam|quiz)\b/i.test(title);
}

export function hourLabel(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalized} ${suffix}`;
}

function parseIsoParts(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: match[4] ? Number(match[4]) : null,
    minute: match[5] ? Number(match[5]) : null,
  };
}

function formatClock(hour: number, minute: number) {
  return timeFormatter.format(new Date(2026, 0, 1, hour, minute));
}

export function getCanvasDeadlineMeta(value: string) {
  const parsed = new Date(value);
  const isoParts = parseIsoParts(value);

  if (isoParts && isoParts.hour !== null && isoParts.minute !== null) {
    return {
      dayKey: `${isoParts.year}-${isoParts.month.toString().padStart(2, "0")}-${isoParts.day
        .toString()
        .padStart(2, "0")}`,
      metaLabel: `Due ${formatClock(isoParts.hour, isoParts.minute)}`,
      sortValue: parsed.getTime(),
    };
  }

  return {
    dayKey: getDateKey(parsed),
    metaLabel: "Due",
    sortValue: parsed.getTime(),
  };
}

export function buildPositionedTasks(tasks: PulseTask[]): PositionedTask[] {
  const items = tasks
    .map((task) => {
      const start = toMinutes(task.scheduledTime);
      const end = Math.max(toMinutes(task.endTime), start + task.durationMinutes);
      return { end, start, task };
    })
    .sort((left, right) => left.start - right.start || left.end - right.end);

  const positioned: PositionedTask[] = [];
  const active: Array<{ end: number; lane: number; positionedIndex: number }> = [];
  let clusterIndices: number[] = [];
  let clusterLaneCount = 1;

  function flushCluster() {
    clusterIndices.forEach((index) => {
      positioned[index].laneCount = Math.max(clusterLaneCount, 1);
    });
    clusterIndices = [];
    clusterLaneCount = 1;
  }

  items.forEach((item) => {
    for (let index = active.length - 1; index >= 0; index -= 1) {
      if (active[index].end <= item.start) {
        active.splice(index, 1);
      }
    }

    if (active.length === 0 && clusterIndices.length) {
      flushCluster();
    }

    const usedLanes = new Set(active.map((entry) => entry.lane));
    let lane = 0;
    while (usedLanes.has(lane)) {
      lane += 1;
    }

    const rawTop = Math.max((item.start - START_MINUTE) * PIXELS_PER_MINUTE, 0);
    const rawHeight = Math.max((item.end - item.start) * PIXELS_PER_MINUTE, 28);
    const positionedIndex =
      positioned.push({
        task: item.task,
        height: Math.round(rawHeight),
        laneCount: 1,
        laneIndex: lane,
        top: Math.round(rawTop),
      }) - 1;

    active.push({ end: item.end, lane, positionedIndex });
    clusterIndices.push(positionedIndex);
    clusterLaneCount = Math.max(clusterLaneCount, ...active.map((entry) => entry.lane + 1));
  });

  if (clusterIndices.length) {
    flushCluster();
  }

  return positioned;
}

export function buildCourseColorMap(
  courses: { id: string; color: string; name: string }[],
): Record<string, { color: string; name: string }> {
  return courses.reduce<Record<string, { color: string; name: string }>>((acc, course) => {
    acc[course.id] = { color: course.color, name: course.name };
    return acc;
  }, {});
}

export function buildDeadlineItemsByDay(
  sortedTasks: PulseTask[],
  assignments: Assignment[],
  courseColorMap: Record<string, { color: string; name: string }>,
): Record<string, CalendarDeadlineItem[]> {
  const items: CalendarDeadlineItem[] = [
    ...sortedTasks.map((task) => {
      const date = new Date(task.dueAt);
      const isExam = task.category === "exam" || isExamLike(task.title);
      return {
        id: `task-${task.id}`,
        title: task.title,
        subtitle: task.courseName ?? categoryMeta[task.category].label,
        metaLabel: timeFormatter.format(date),
        color: isExam ? EXAM_ACCENT : categoryMeta[task.category].color,
        backgroundColor: isExam ? "rgba(212,83,126,0.18)" : categoryMeta[task.category].tint,
        dayKey: getDateKey(date),
        isExam,
        sortValue: date.getTime(),
        source: "task" as const,
      };
    }),
    ...assignments.map((assignment) => {
      const course = courseColorMap[assignment.courseId];
      const isExam = isExamLike(assignment.title);
      const deadlineMeta = getCanvasDeadlineMeta(assignment.dueDate);
      return {
        id: `assignment-${assignment.id}`,
        title: assignment.title,
        subtitle: course?.name ?? "Canvas",
        metaLabel: deadlineMeta.metaLabel,
        color: isExam ? EXAM_ACCENT : course?.color ?? WORK_ACCENT,
        backgroundColor: isExam ? "rgba(212,83,126,0.18)" : `${course?.color ?? WORK_ACCENT}1f`,
        dayKey: deadlineMeta.dayKey,
        isExam,
        sortValue: deadlineMeta.sortValue,
        source: "assignment" as const,
      };
    }),
  ];

  return items.reduce<Record<string, CalendarDeadlineItem[]>>((acc, item) => {
    acc[item.dayKey] = [...(acc[item.dayKey] ?? []), item].sort(
      (left, right) => left.sortValue - right.sortValue,
    );
    return acc;
  }, {});
}

export function buildDayStates(
  displayedDays: Date[],
  deadlineItemsByDay: Record<string, CalendarDeadlineItem[]>,
  todayScheduledBlockCount: number,
  todayKey: string,
): Record<string, CalendarDayState> {
  const states: Record<string, CalendarDayState> = {};
  displayedDays.forEach((day) => {
    const key = getDateKey(day);
    const deadlineItems = deadlineItemsByDay[key] ?? [];
    const hasScheduledTasks = key === todayKey && todayScheduledBlockCount > 0;
    states[key] = {
      hasAssignments: deadlineItems.length > 0 || hasScheduledTasks,
      hasExams: deadlineItems.some((item) => item.isExam),
      hasScheduledTasks,
      itemCount: deadlineItems.length + (hasScheduledTasks ? todayScheduledBlockCount : 0),
    };
  });
  return states;
}

export function displayedDaysForRange(range: CalendarRange, anchorDate: Date): Date[] {
  switch (range) {
    case "day":
      return [anchorDate];
    case "3days":
      return Array.from({ length: 3 }, (_, index) => addDays(anchorDate, index));
    case "7days":
      return Array.from({ length: 7 }, (_, index) => addDays(anchorDate, index));
    default:
      return buildMonthDays(anchorDate);
  }
}

export function shiftAnchorDate(
  current: Date,
  range: CalendarRange,
  direction: -1 | 1,
): Date {
  if (range === "month") {
    return addMonths(current, direction);
  }
  if (range === "day") {
    return addDays(current, direction);
  }
  if (range === "3days") {
    return addDays(current, direction * 3);
  }
  return addDays(current, direction * 7);
}

export function timelineColumnMinWidth(range: CalendarRange): number {
  if (range === "day") return 640;
  if (range === "3days") return 340;
  return 260;
}

export function summaryPreviewCountForRange(range: CalendarRange): number {
  if (range === "day") return 4;
  if (range === "3days") return 3;
  return 2;
}

export function totalTimelineHeightPx(): number {
  return HOURS.length * 60 * PIXELS_PER_MINUTE;
}

export function minutesSinceStartOfDay(now: Date): number {
  return now.getHours() * 60 + now.getMinutes() - START_MINUTE;
}

/** Must match the first column of the timeline CSS grid */
export const CALENDAR_TIME_COLUMN = "4.5rem";

/**
 * Shared column template for header + body. `minmax(0, 1fr)` keeps equal fr tracks and
 * allows `min-w-0` on cells to clamp long text; use a min-width on the grid for readability.
 */
export function buildTimelineGridColumns(dayCount: number) {
  return `${CALENDAR_TIME_COLUMN} repeat(${dayCount}, minmax(0, 1fr))`;
}

/** Minimum width for the whole timeline so columns do not collapse below a readable size */
export function buildTimelineMinWidth(dayCount: number, dayMinWidthPx: number) {
  return `calc(${CALENDAR_TIME_COLUMN} + ${dayCount} * ${dayMinWidthPx}px)`;
}
