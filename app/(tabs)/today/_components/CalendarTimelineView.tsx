"use client";

import type { Ref } from "react";

import { cn } from "@/lib/utils";

import type {
  CalendarDayState,
  CalendarDeadlineItem,
  CalendarRange,
  PositionedTask,
} from "../_lib/calendar-helpers";
import {
  formatDayNumber,
  formatWeekdayShort,
  getDateKey,
  HALF_HOUR_MARKS,
  hourLabel,
  HOURS,
  isSameDay,
  PIXELS_PER_MINUTE,
  totalTimelineHeightPx,
} from "../_lib/calendar-helpers";

import { CalendarTaskCard } from "./CalendarTaskCard";

type CalendarTimelineViewProps = {
  timelineDays: Date[];
  today: Date;
  todayKey: string;
  range: CalendarRange;
  /** Single `grid-template-columns` for header + body (shared track sizing) */
  gridTemplateColumns: string;
  /** Ensures the grid is wide enough to scroll horizontally when the viewport is narrow */
  timelineMinWidth: string;
  summaryPreviewCount: number;
  scrollContainerRef: Ref<HTMLDivElement>;
  deadlineItemsByDay: Record<string, CalendarDeadlineItem[]>;
  dayStates: Record<string, CalendarDayState>;
  positionedTasks: PositionedTask[];
  currentLineY: number;
  onCompleteTask: (id: string) => void;
  onSkipTask: (id: string) => void;
  onStartTask: (id: string) => void;
};

export function CalendarTimelineView({
  timelineDays,
  today,
  todayKey,
  range,
  gridTemplateColumns,
  timelineMinWidth,
  summaryPreviewCount,
  scrollContainerRef,
  deadlineItemsByDay,
  dayStates,
  positionedTasks,
  currentLineY,
  onCompleteTask,
  onSkipTask,
  onStartTask,
}: CalendarTimelineViewProps) {
  const totalHeight = totalTimelineHeightPx();

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-border/80 bg-background-secondary/20">
      {/*
        One horizontal scroller: header row + body share the same grid columns so tracks stay aligned.
        Body uses CSS subgrid so column widths match row 1 exactly.
      */}
      <div className="overflow-x-auto overscroll-x-contain">
        <div
          className="grid min-w-0"
          style={{
            gridTemplateColumns,
            gridTemplateRows: "auto minmax(0, min(72vh, 900px))",
            minWidth: timelineMinWidth,
            width: "100%",
          }}
        >
          {/* —— Row 1: day headers (same column tracks as body) —— */}
          <div className="sticky left z-30 min-w-0 border-b border-r border-border/60 bg-background-tertiary/95 px-3 py-3 backdrop-blur-sm sm:px-md sm:py-md">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
              Summary
            </p>
            <p className="mt-1 text-xs leading-snug text-text-secondary">Deadlines and markers</p>
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
                  "min-w-0 overflow-hidden border-b border-r border-border/60 px-2 py-3 sm:px-md sm:py-md",
                  isToday ? "bg-accent-primary/[0.07]" : "bg-background-secondary/65",
                )}
              >
                <div
                  className={cn(
                    "flex min-h-[160px] min-w-0 flex-col rounded-xl border px-md py-md",
                    dayState?.hasExams
                      ? "border-[#D4537E]/40 bg-[#D4537E]/[0.07]"
                      : hasWork
                        ? "border-accent-quaternary/30 bg-accent-quaternary/[0.06]"
                        : "border-border/55 bg-background-secondary/40",
                    isToday && "ring-1 ring-inset ring-accent-primary/25",
                  )}
                >
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[0.68rem] uppercase tracking-[0.16em] text-text-tertiary">
                        {formatWeekdayShort(day)}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <p className="text-lg font-semibold tabular-nums text-text-primary">
                          {formatDayNumber(day)}
                        </p>
                        {hasWork && !dayState?.hasExams ? (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-accent-quaternary" aria-hidden />
                        ) : null}
                      </div>
                    </div>

                    {dayState?.hasExams ? (
                      <span className="shrink-0 rounded-full bg-[#D4537E]/12 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#D4537E]">
                        Exam
                      </span>
                    ) : isToday ? (
                      <span className="shrink-0 rounded-full bg-accent-primary px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-background-primary">
                        Today
                      </span>
                    ) : hasWork ? (
                      <span className="shrink-0 rounded-full bg-accent-quaternary/12 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-accent-quaternary">
                        Work
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 flex min-w-0 flex-1 flex-col gap-2">
                    {dayState?.hasScheduledTasks ? (
                      <div className="min-w-0 rounded-lg border border-accent-secondary/28 bg-accent-secondary/10 px-3 py-2">
                        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-accent-secondary">
                          Scheduled
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-text-primary">
                          {positionedTasks.length} block{positionedTasks.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    ) : null}

                    {deadlineItems.length ? (
                      deadlineItems.slice(0, summaryPreviewCount).map((item) => (
                        <div
                          key={item.id}
                          className="min-w-0 rounded-lg border px-3 py-2"
                          style={{
                            backgroundColor: item.backgroundColor,
                            borderColor: `${item.color}4d`,
                          }}
                          title={`${item.metaLabel} · ${item.title} · ${item.subtitle}`}
                        >
                          <div className="flex min-w-0 items-start justify-between gap-2">
                            <span
                              className="min-w-0 shrink text-[0.58rem] font-semibold uppercase tracking-[0.14em]"
                              style={{ color: item.color }}
                            >
                              {item.isExam ? "Exam" : item.metaLabel}
                            </span>
                            <span className="shrink-0 text-[0.58rem] uppercase tracking-[0.12em] text-text-secondary">
                              {item.source === "assignment" ? "Canvas" : "Task"}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 break-words text-sm font-semibold leading-snug text-text-primary">
                            {item.title}
                          </p>
                          <p className="line-clamp-2 break-words text-[0.66rem] leading-4 text-text-secondary">
                            {item.subtitle}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="min-w-0 rounded-lg border border-dashed border-border/50 bg-background-secondary/25 px-3 py-2 text-sm text-text-secondary">
                        No due items
                      </div>
                    )}

                    {deadlineItems.length > summaryPreviewCount ? (
                      <p className="text-[0.65rem] text-text-tertiary">
                        +{deadlineItems.length - summaryPreviewCount} more due item
                        {deadlineItems.length - summaryPreviewCount === 1 ? "" : "s"}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}

          {/* —— Row 2: time labels + day columns (subgrid = same columns as row 1) —— */}
          <div
            ref={scrollContainerRef}
            className="grid min-h-0 min-w-0 overflow-y-auto border-t border-border/50 [grid-column:1/-1] [grid-row:2]"
            style={{
              gridTemplateColumns: "subgrid",
            }}
          >
            <div className="sticky left z-10 min-w-0 border-r border-border/60 bg-background-tertiary/85">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className={cn(
                    "box-border flex w-full min-w-0 border-b border-border/35 px-2 pt-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-text-tertiary",
                    hour % 2 === 0 ? "bg-background-tertiary/90" : "bg-background-tertiary/70",
                  )}
                  style={{
                    height: `${60 * PIXELS_PER_MINUTE}px`,
                  }}
                >
                  <span className="tabular-nums">{hourLabel(hour)}</span>
                </div>
              ))}
            </div>

            {timelineDays.map((day) => {
              const key = getDateKey(day);
              const isToday = isSameDay(day, today);
              const dayState = dayStates[key];
              const hasWork = Boolean(dayState?.hasAssignments || dayState?.hasScheduledTasks);
              const dayTasks: PositionedTask[] = key === todayKey ? positionedTasks : [];

              return (
                <div
                  key={`column-${key}`}
                  className={cn(
                    "relative isolate min-w-0 border-r border-border/60 last:border-r-0",
                    dayState?.hasExams ? "bg-[rgba(212,83,126,0.025)]" : "",
                    !dayState?.hasExams && hasWork ? "bg-accent-quaternary/[0.04]" : "",
                    !dayState?.hasExams && !hasWork ? "bg-background-secondary/15" : "",
                    isToday && "ring-1 ring-inset ring-accent-primary/18",
                  )}
                  style={{ height: `${totalHeight}px` }}
                >
                  {hasWork ? (
                    <div
                      className={cn(
                        "pointer-events-none absolute inset-y-0 left-0 w-0.5",
                        dayState?.hasExams ? "bg-[#D4537E]/55" : "bg-accent-quaternary/50",
                      )}
                    />
                  ) : null}

                  {HOURS.map((hour) => (
                    <div
                      key={`zebra-${key}-${hour}`}
                      className={cn(
                        "pointer-events-none absolute inset-x-0",
                        hour % 2 === 0 ? "bg-transparent" : "bg-background-primary/[0.025]",
                      )}
                      style={{
                        top: `${hour * 60 * PIXELS_PER_MINUTE}px`,
                        height: `${60 * PIXELS_PER_MINUTE}px`,
                      }}
                    />
                  ))}

                  {HALF_HOUR_MARKS.map((minute) => (
                    <div
                      key={`${key}-${minute}`}
                      className={cn(
                        "pointer-events-none absolute inset-x-0 border-t",
                        minute % 60 === 0 ? "border-border/40" : "border-border/12",
                      )}
                      style={{ top: `${minute * PIXELS_PER_MINUTE}px` }}
                    />
                  ))}

                  {isToday && currentLineY > 0 && currentLineY < totalHeight ? (
                    <>
                      <div
                        className="pointer-events-none absolute inset-x-0 z-20 border-t-2 border-accent-primary"
                        style={{ top: `${Math.round(currentLineY)}px` }}
                      />
                      <div
                        className="pointer-events-none absolute -left-1 z-20 h-2.5 w-2.5 rounded-full border-2 border-background-primary bg-accent-primary"
                        style={{ top: `${Math.max(Math.round(currentLineY) - 5, 0)}px` }}
                      />
                    </>
                  ) : null}

                  {dayTasks.length ? (
                    dayTasks.map((positionedTask) => {
                      const laneCount = positionedTask.laneCount;
                      const laneIndex = positionedTask.laneIndex;
                      const widthPct = 100 / laneCount;
                      const leftPct = laneIndex * widthPct;
                      const compact =
                        laneCount > 1 || (range === "7days" && positionedTask.height < 72);

                      return (
                        <div
                          key={positionedTask.task.id}
                          className="absolute z-10 box-border min-w-0 px-0.5"
                          style={{
                            height: `${positionedTask.height}px`,
                            left: `${leftPct}%`,
                            top: `${positionedTask.top}px`,
                            width: `${widthPct}%`,
                          }}
                        >
                          <CalendarTaskCard
                            compact={compact}
                            height={positionedTask.height}
                            interactive={range === "day" && positionedTask.laneCount === 1}
                            onComplete={onCompleteTask}
                            onSkip={onSkipTask}
                            onStart={onStartTask}
                            task={positionedTask.task}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="absolute inset-x-2 top-3 min-w-0 rounded-lg border border-dashed border-border/55 bg-background-secondary/30 px-2 py-md sm:inset-x-3 sm:px-md">
                      <p className="break-words text-sm text-text-secondary">
                        {isToday
                          ? "No scheduled blocks yet."
                          : hasWork
                            ? "Deadlines are in the summary row above."
                            : "Nothing on this day."}
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
  );
}
