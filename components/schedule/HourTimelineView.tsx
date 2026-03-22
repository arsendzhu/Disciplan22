"use client";

import { ChevronLeft, ChevronRight, CircleDot } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { categoryMeta } from "@/constants/schedule";
import { useCanvasData } from "@/hooks/useCanvasData";
import { toMinutes } from "@/lib/schedule-logic";
import { cn } from "@/lib/utils";
import { useNPCStore } from "@/store/npcStore";
import { PulseTask, useScheduleStore } from "@/store/scheduleStore";

import { BodyText } from "../ui/BodyText";
import { Card } from "../ui/Card";

const hours = Array.from({ length: 24 }, (_, index) => index);
const halfHourMarks = Array.from({ length: 49 }, (_, index) => index * 30);
const startMinute = 0;
const pixelsPerMinute = 1;
const examAccent = "#D4537E";
const workAccent = "#8BA7D4";
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
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

type CalendarRange = "day" | "3days" | "7days" | "month";
type CalendarDayState = {
  hasAssignments: boolean;
  hasExams: boolean;
  hasScheduledTasks: boolean;
  itemCount: number;
};
type CalendarDeadlineItem = {
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
type PositionedTask = {
  task: PulseTask;
  height: number;
  laneCount: number;
  laneIndex: number;
  top: number;
};

const rangeMeta: Array<{ label: string; value: CalendarRange }> = [
  { label: "Day", value: "day" },
  { label: "3 Days", value: "3days" },
  { label: "7 Days", value: "7days" },
  { label: "Month", value: "month" },
];

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function startOfMonth(date: Date) {
  const value = startOfDay(date);
  value.setDate(1);
  return value;
}

function addDays(date: Date, days: number) {
  const value = startOfDay(date);
  value.setDate(value.getDate() + days);
  return value;
}

function addMonths(date: Date, months: number) {
  const value = startOfMonth(date);
  value.setMonth(value.getMonth() + months);
  return value;
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

function isSameDay(left: Date, right: Date) {
  return getDateKey(left) === getDateKey(right);
}

function buildMonthDays(anchorDate: Date) {
  const monthStart = startOfMonth(anchorDate);
  const calendarStart = addDays(monthStart, -monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => addDays(calendarStart, index));
}

function getRangeTitle(range: CalendarRange, anchorDate: Date, days: Date[]) {
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

function isExamLike(title: string) {
  return /\b(midterm|final|exam|quiz)\b/i.test(title);
}

function hourLabel(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalized} ${suffix}`;
}

function parseIsoParts(value: string) {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?/,
  );

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

function getCanvasDeadlineMeta(value: string) {
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

function buildPositionedTasks(tasks: PulseTask[]) {
  const items = tasks
    .map((task) => {
      const start = toMinutes(task.scheduledTime);
      const end = Math.max(toMinutes(task.endTime), start + task.durationMinutes);

      return {
        end,
        start,
        task,
      };
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

    const positionedIndex =
      positioned.push({
        task: item.task,
        height: Math.max((item.end - item.start) * pixelsPerMinute, 28),
        laneCount: 1,
        laneIndex: lane,
        top: Math.max((item.start - startMinute) * pixelsPerMinute, 0),
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

function CalendarTaskCard({
  task,
  height,
  interactive,
  compact,
  onComplete,
  onSkip,
  onStart,
}: {
  task: PulseTask;
  height: number;
  interactive: boolean;
  compact: boolean;
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
  onStart: (id: string) => void;
}) {
  const category = categoryMeta[task.category];
  const timeLabel = height >= 54 ? `${task.scheduledTime} - ${task.endTime}` : task.scheduledTime;
  const showCourse = height >= (compact ? 48 : 40);
  const showActions = interactive && !compact && height >= 104;
  const titleClampClass =
    compact && height < 58 ? "line-clamp-1" : "line-clamp-2";

  return (
    <article
      className={cn(
        "h-full overflow-hidden rounded-lg border border-border/70 bg-background-secondary/96 shadow-[0_10px_24px_rgba(0,0,0,0.16)]",
        task.status === "in_progress" && "border-accent-primary/40 bg-accent-primary/6",
      )}
      style={{ borderLeftColor: category.color, borderLeftWidth: 3 }}
      title={`${task.scheduledTime} - ${task.endTime} · ${task.title}${task.courseName ? ` · ${task.courseName}` : ""}`}
    >
      <div className="flex h-full flex-col gap-0.5 px-2 py-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
              {timeLabel}
            </p>
            <p
              className={cn(
                "text-[0.78rem] font-semibold leading-4 text-text-primary",
                titleClampClass,
              )}
            >
              {task.title}
            </p>
          </div>

          {task.status === "in_progress" ? (
            compact ? (
              <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-accent-primary" />
            ) : (
              <span className="rounded-full bg-accent-primary/14 px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-accent-primary">
                Live
              </span>
            )
          ) : null}
        </div>

        {showCourse ? (
          <p className="truncate text-[0.68rem] leading-4 text-text-secondary">
            {task.courseName ?? category.label}
          </p>
        ) : null}

        {showActions ? (
          <div className="mt-auto flex items-center gap-1">
            <button
              className="rounded-full border border-accent-primary/30 bg-accent-primary/10 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-accent-primary transition hover:bg-accent-primary/16"
              onClick={() => onStart(task.id)}
              type="button"
            >
              Start
            </button>
            <button
              className="rounded-full border border-accent-secondary/30 bg-accent-secondary/10 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-accent-secondary transition hover:bg-accent-secondary/16"
              onClick={() => onComplete(task.id)}
              type="button"
            >
              Done
            </button>
            <button
              className="rounded-full border border-accent-tertiary/30 bg-accent-tertiary/10 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-accent-tertiary transition hover:bg-accent-tertiary/16"
              onClick={() => onSkip(task.id)}
              type="button"
            >
              Skip
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function HourTimelineView({ tasks }: { tasks: PulseTask[] }) {
  const { assignments, courses } = useCanvasData();
  const completeTask = useScheduleStore((state) => state.completeTask);
  const skipTask = useScheduleStore((state) => state.skipTask);
  const startTask = useScheduleStore((state) => state.startTask);
  const celebrateTaskCompletion = useNPCStore((state) => state.celebrateTaskCompletion);

  const [range, setRange] = useState<CalendarRange>("day");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const today = useMemo(() => startOfDay(new Date()), []);
  const [anchorDate, setAnchorDate] = useState(today);

  const totalHeight = hours.length * 60 * pixelsPerMinute;
  const now = new Date();
  const currentLine = (now.getHours() * 60 + now.getMinutes() - startMinute) * pixelsPerMinute;
  const todayKey = getDateKey(today);

  const sortedTasks = useMemo(
    () => [...tasks].sort((left, right) => left.scheduledTime.localeCompare(right.scheduledTime)),
    [tasks],
  );
  const positionedTasks = useMemo(() => buildPositionedTasks(sortedTasks), [sortedTasks]);

  const courseColorMap = useMemo(
    () =>
      courses.reduce<Record<string, { color: string; name: string }>>((accumulator, course) => {
        accumulator[course.id] = { color: course.color, name: course.name };
        return accumulator;
      }, {}),
    [courses],
  );

  const deadlineItemsByDay = useMemo(() => {
    const items: CalendarDeadlineItem[] = [
      ...sortedTasks.map((task) => {
        const date = new Date(task.dueAt);
        const isExam = task.category === "exam" || isExamLike(task.title);

        return {
          id: `task-${task.id}`,
          title: task.title,
          subtitle: task.courseName ?? categoryMeta[task.category].label,
          metaLabel: timeFormatter.format(date),
          color: isExam ? examAccent : categoryMeta[task.category].color,
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
          color: isExam ? examAccent : course?.color ?? workAccent,
          backgroundColor: isExam ? "rgba(212,83,126,0.18)" : `${course?.color ?? workAccent}1f`,
          dayKey: deadlineMeta.dayKey,
          isExam,
          sortValue: deadlineMeta.sortValue,
          source: "assignment" as const,
        };
      }),
    ];

    return items.reduce<Record<string, CalendarDeadlineItem[]>>((accumulator, item) => {
      accumulator[item.dayKey] = [...(accumulator[item.dayKey] ?? []), item].sort(
        (left, right) => left.sortValue - right.sortValue,
      );
      return accumulator;
    }, {});
  }, [assignments, courseColorMap, sortedTasks]);

  const displayedDays = useMemo(() => {
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
  }, [anchorDate, range]);

  const currentRangeTitle = useMemo(
    () => getRangeTitle(range, anchorDate, displayedDays),
    [anchorDate, displayedDays, range],
  );

  const timelineDays = range === "month" ? [] : displayedDays;
  const dayColumnMinWidth = range === "day" ? 660 : range === "3days" ? 360 : 280;
  const gridTemplateColumns = `78px repeat(${timelineDays.length}, minmax(${dayColumnMinWidth}px, 1fr))`;
  const summaryPreviewCount = range === "day" ? 4 : range === "3days" ? 3 : 2;

  const dayStates = useMemo(() => {
    const states: Record<string, CalendarDayState> = {};

    displayedDays.forEach((day) => {
      const key = getDateKey(day);
      const deadlineItems = deadlineItemsByDay[key] ?? [];
      const hasScheduledTasks = key === todayKey && positionedTasks.length > 0;

      states[key] = {
        hasAssignments: deadlineItems.length > 0 || hasScheduledTasks,
        hasExams: deadlineItems.some((item) => item.isExam),
        hasScheduledTasks,
        itemCount: deadlineItems.length + (hasScheduledTasks ? positionedTasks.length : 0),
      };
    });

    return states;
  }, [deadlineItemsByDay, displayedDays, positionedTasks.length, todayKey]);

  useEffect(() => {
    if (range === "month" || !scrollContainerRef.current) return;
    scrollContainerRef.current.scrollTop = Math.max(currentLine - 240, 0);
  }, [anchorDate, currentLine, range]);

  function shiftRange(direction: -1 | 1) {
    setAnchorDate((current) => {
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
    });
  }

  return (
    <Card className="space-y-lg overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-md">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-primary">
            Calendar
          </p>
          <p className="mt-sm font-display text-[clamp(1.55rem,1.2rem+0.8vw,2rem)] text-text-primary">
            {currentRangeTitle}
          </p>
          <BodyText className="mt-sm text-sm">
            Full-day planning with cleaner time blocks, Canvas deadlines, and stronger day markers
            for work and exams.
          </BodyText>
        </div>

        <div className="flex flex-wrap items-center gap-sm">
          <div className="flex items-center gap-xs rounded-full border border-border bg-background-tertiary/55 p-1">
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-text-tertiary transition hover:bg-background-secondary hover:text-text-primary"
              onClick={() => shiftRange(-1)}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="rounded-full border border-border px-md py-sm text-xs font-semibold uppercase tracking-[0.18em] text-text-primary transition hover:border-accent-primary/35 hover:text-accent-primary"
              onClick={() => setAnchorDate(today)}
              type="button"
            >
              Today
            </button>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-text-tertiary transition hover:bg-background-secondary hover:text-text-primary"
              onClick={() => shiftRange(1)}
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-xs rounded-full border border-border bg-background-tertiary/55 p-1">
            {rangeMeta.map((item) => {
              const active = range === item.value;

              return (
                <button
                  key={item.value}
                  className={cn(
                    "rounded-full px-md py-sm text-xs font-semibold uppercase tracking-[0.18em] transition",
                    active
                      ? "bg-accent-primary/12 text-accent-primary"
                      : "text-text-tertiary hover:text-text-primary",
                  )}
                  onClick={() => setRange(item.value)}
                  type="button"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {range === "month" ? (
        <div className="overflow-hidden rounded-xl border border-border/70">
          <div className="grid grid-cols-7 border-b border-border/60 bg-background-tertiary/50">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
              <div
                key={label}
                className="px-md py-sm text-center text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-text-tertiary"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {displayedDays.map((day) => {
              const key = getDateKey(day);
              const deadlineItems = deadlineItemsByDay[key] ?? [];
              const inMonth = day.getMonth() === anchorDate.getMonth();
              const isToday = isSameDay(day, today);
              const dayState = dayStates[key];
              const hasWork = Boolean(dayState?.hasAssignments || dayState?.hasScheduledTasks);

              return (
                <button
                  key={key}
                  className={cn(
                    "relative min-h-[154px] border-b border-r border-border/60 bg-background-secondary/60 p-md text-left transition hover:bg-background-tertiary/45",
                    !inMonth && "bg-background-primary/35 text-text-tertiary",
                    isToday && "bg-accent-primary/7",
                    hasWork && "shadow-[inset_0_0_0_1px_rgba(139,167,212,0.3)]",
                    dayState?.hasExams && "shadow-[inset_0_0_0_2px_rgba(212,83,126,0.35)]",
                  )}
                  onClick={() => {
                    setAnchorDate(day);
                    setRange("day");
                  }}
                  type="button"
                >
                  {hasWork ? (
                    <div
                      className={cn(
                        "absolute inset-x-0 top-0 h-1",
                        dayState?.hasExams ? "bg-[#D4537E]" : "bg-accent-quaternary/80",
                      )}
                    />
                  ) : null}

                  <div className="flex items-center justify-between gap-sm">
                    <span
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                        isToday
                          ? "bg-accent-primary text-background-primary"
                          : "text-text-primary",
                        !inMonth && "text-text-tertiary",
                      )}
                    >
                      {day.getDate()}
                    </span>
                    {dayState?.hasExams ? (
                      <span className="rounded-full bg-[#D4537E]/12 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#D4537E]">
                        Exam
                      </span>
                    ) : isToday ? (
                      <span className="text-[0.65rem] uppercase tracking-[0.16em] text-accent-primary">
                        Today
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-md space-y-1.5">
                    {dayState?.hasScheduledTasks ? (
                      <div className="rounded-md border border-accent-secondary/30 bg-accent-secondary/10 px-2 py-1 text-[0.68rem] text-accent-secondary">
                        {positionedTasks.length} scheduled blocks
                      </div>
                    ) : null}
                    {deadlineItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="truncate rounded-md px-2 py-1 text-[0.7rem] font-medium"
                        style={{
                          backgroundColor: item.backgroundColor,
                          color: item.color,
                        }}
                      >
                        {item.title}
                      </div>
                    ))}
                    {deadlineItems.length > 3 ? (
                      <div className="text-[0.7rem] text-text-tertiary">
                        +{deadlineItems.length - 3} more
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/70">
          <div className="overflow-x-auto">
            <div
              className="grid border-b border-border/60 bg-background-tertiary/55"
              style={{ gridTemplateColumns }}
            >
              <div className="sticky left-0 z-20 border-r border-border/60 bg-background-tertiary/95 px-md py-md backdrop-blur">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-text-tertiary">
                  Day summary
                </p>
                <p className="mt-1 text-xs text-text-secondary">Deadlines, exams, and day markers</p>
              </div>

              {timelineDays.map((day) => {
                const key = getDateKey(day);
                const deadlineItems = deadlineItemsByDay[key] ?? [];
                const isToday = isSameDay(day, today);
                const dayState = dayStates[key];
                const hasWork = Boolean(dayState?.hasAssignments || dayState?.hasScheduledTasks);

                return (
                  <div
                    key={`header-${key}`}
                    className={cn(
                      "border-r border-border/60 px-md py-md",
                      isToday ? "bg-accent-primary/6" : "bg-background-secondary/70",
                    )}
                  >
                    <div
                      className={cn(
                        "min-h-[188px] rounded-xl border px-md py-md",
                        dayState?.hasExams
                          ? "border-[#D4537E]/45 bg-[#D4537E]/8"
                          : hasWork
                            ? "border-accent-quaternary/35 bg-accent-quaternary/8"
                            : "border-border/50 bg-background-secondary/35",
                        isToday && "ring-1 ring-inset ring-accent-primary/25",
                      )}
                    >
                      <div className="flex items-start justify-between gap-sm">
                        <div>
                          <p className="text-[0.72rem] uppercase tracking-[0.18em] text-text-tertiary">
                            {weekdayFormatter.format(day)}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <p className="text-lg font-semibold text-text-primary">
                              {dayNumberFormatter.format(day)}
                            </p>
                            {hasWork && !dayState?.hasExams ? (
                              <span className="h-2.5 w-2.5 rounded-full bg-accent-quaternary" />
                            ) : null}
                          </div>
                        </div>

                        {dayState?.hasExams ? (
                          <span className="rounded-full bg-[#D4537E]/12 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#D4537E]">
                            Exam
                          </span>
                        ) : isToday ? (
                          <span className="rounded-full bg-accent-primary px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-background-primary">
                            Today
                          </span>
                        ) : hasWork ? (
                          <span className="rounded-full bg-accent-quaternary/12 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-accent-quaternary">
                            Work
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-md space-y-2">
                        {dayState?.hasScheduledTasks ? (
                          <div className="rounded-lg border border-accent-secondary/28 bg-accent-secondary/10 px-3 py-2">
                            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-accent-secondary">
                              Scheduled
                            </p>
                            <p className="mt-1 text-sm font-semibold text-text-primary">
                              {positionedTasks.length} time block{positionedTasks.length === 1 ? "" : "s"}
                            </p>
                          </div>
                        ) : null}

                        {deadlineItems.length ? (
                          deadlineItems.slice(0, summaryPreviewCount).map((item) => (
                            <div
                              key={item.id}
                              className="rounded-lg border px-3 py-2"
                              style={{
                                backgroundColor: item.backgroundColor,
                                borderColor: `${item.color}4d`,
                              }}
                              title={`${item.metaLabel} · ${item.title} · ${item.subtitle}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span
                                  className="text-[0.62rem] font-semibold uppercase tracking-[0.16em]"
                                  style={{ color: item.color }}
                                >
                                  {item.isExam ? "Exam" : item.metaLabel}
                                </span>
                                <span className="shrink-0 text-[0.62rem] uppercase tracking-[0.14em] text-text-secondary">
                                  {item.source === "assignment" ? "Canvas" : "Task"}
                                </span>
                              </div>
                              <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-text-primary">
                                {item.title}
                              </p>
                              <p className="line-clamp-2 text-[0.68rem] leading-4 text-text-secondary">
                                {item.subtitle}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-lg border border-dashed border-border/55 bg-background-secondary/30 px-3 py-2 text-sm text-text-secondary">
                            No due items
                          </div>
                        )}

                        {deadlineItems.length > summaryPreviewCount ? (
                          <p className="text-[0.68rem] text-text-tertiary">
                            +{deadlineItems.length - summaryPreviewCount} more due item
                            {deadlineItems.length - summaryPreviewCount === 1 ? "" : "s"}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div ref={scrollContainerRef} className="max-h-[72vh] overflow-y-auto">
              <div className="grid" style={{ gridTemplateColumns }}>
                <div className="sticky left-0 z-10 border-r border-border/60 bg-background-tertiary/78">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="relative border-b border-border/40 px-sm pt-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-text-tertiary"
                      style={{ height: `${60 * pixelsPerMinute}px` }}
                    >
                      {hourLabel(hour)}
                    </div>
                  ))}
                </div>

                {timelineDays.map((day) => {
                  const key = getDateKey(day);
                  const isToday = isSameDay(day, today);
                  const dayState = dayStates[key];
                  const hasWork = Boolean(dayState?.hasAssignments || dayState?.hasScheduledTasks);
                  const dayTasks = key === todayKey ? positionedTasks : [];

                  return (
                    <div
                      key={`column-${key}`}
                      className={cn(
                        "relative border-r border-border/60 last:border-r-0",
                        dayState?.hasExams
                          ? "bg-[rgba(212,83,126,0.03)]"
                          : hasWork
                            ? "bg-accent-quaternary/5"
                            : "bg-background-secondary/20",
                        isToday && "ring-1 ring-inset ring-accent-primary/20",
                      )}
                      style={{ height: `${totalHeight}px` }}
                    >
                      {hasWork ? (
                        <div
                          className={cn(
                            "absolute inset-y-0 left-0 w-1",
                            dayState?.hasExams ? "bg-[#D4537E]/60" : "bg-accent-quaternary/55",
                          )}
                        />
                      ) : null}

                      {halfHourMarks.map((minute) => (
                        <div
                          key={`${key}-${minute}`}
                          className={cn(
                            "absolute inset-x-0 border-t",
                            minute % 60 === 0 ? "border-border/45" : "border-border/15",
                          )}
                          style={{ top: `${minute * pixelsPerMinute}px` }}
                        />
                      ))}

                      {isToday && currentLine > 0 && currentLine < totalHeight ? (
                        <>
                          <div
                            className="absolute inset-x-0 z-20 border-t border-accent-primary/70 shadow-[0_0_18px_rgba(232,201,122,0.35)]"
                            style={{ top: `${currentLine}px` }}
                          />
                          <div
                            className="absolute -left-1.5 z-20 h-3 w-3 rounded-full border border-background-primary bg-accent-primary shadow-[0_0_16px_rgba(232,201,122,0.45)]"
                            style={{ top: `${Math.max(currentLine - 6, 0)}px` }}
                          />
                        </>
                      ) : null}

                      {dayTasks.length ? (
                        dayTasks.map((positionedTask) => {
                          const width = 100 / positionedTask.laneCount;
                          const left = positionedTask.laneIndex * width;
                          const compact =
                            positionedTask.laneCount > 1 ||
                            (range === "7days" && positionedTask.height < 72);

                          return (
                            <div
                              key={positionedTask.task.id}
                              className="absolute z-10"
                              style={{
                                height: `${positionedTask.height}px`,
                                left: `calc(${left}% + 0.35rem)`,
                                top: `${positionedTask.top}px`,
                                width: `calc(${width}% - 0.7rem)`,
                              }}
                            >
                              <CalendarTaskCard
                                compact={compact}
                                height={positionedTask.height}
                                interactive={range === "day" && positionedTask.laneCount === 1}
                                onComplete={(id) => {
                                  completeTask(id);
                                  celebrateTaskCompletion();
                                }}
                                onSkip={skipTask}
                                onStart={startTask}
                                task={positionedTask.task}
                              />
                            </div>
                          );
                        })
                      ) : (
                        <div className="absolute inset-x-4 top-4 rounded-lg border border-dashed border-border/60 bg-background-secondary/35 px-md py-md">
                          <p className="text-sm text-text-secondary">
                            {isToday
                              ? "No scheduled blocks yet."
                              : hasWork
                                ? "Deadlines are listed above."
                                : "Nothing scheduled on this day."}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-sm text-[0.72rem] uppercase tracking-[0.16em] text-text-tertiary">
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-md py-sm">
          <CircleDot className="h-3.5 w-3.5 text-accent-quaternary" />
          Day with work
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-md py-sm">
          <CircleDot className="h-3.5 w-3.5 text-[#D4537E]" />
          Midterm or final
        </span>
      </div>
    </Card>
  );
}
