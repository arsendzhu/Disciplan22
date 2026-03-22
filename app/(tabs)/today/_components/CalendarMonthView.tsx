"use client";

import { cn } from "@/lib/utils";

import type {
  CalendarDayState,
  CalendarDeadlineItem,
  PositionedTask,
} from "../_lib/calendar-helpers";
import { getDateKey, isSameDay, WEEKDAY_HEADERS } from "../_lib/calendar-helpers";

type CalendarMonthViewProps = {
  displayedDays: Date[];
  anchorDate: Date;
  today: Date;
  deadlineItemsByDay: Record<string, CalendarDeadlineItem[]>;
  dayStates: Record<string, CalendarDayState>;
  positionedTasks: PositionedTask[];
  onSelectDay: (day: Date) => void;
};

export function CalendarMonthView({
  displayedDays,
  anchorDate,
  today,
  deadlineItemsByDay,
  dayStates,
  positionedTasks,
  onSelectDay,
}: CalendarMonthViewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-background-secondary/30">
      <div className="grid grid-cols-7 border-b border-border/60 bg-background-tertiary/40">
        {WEEKDAY_HEADERS.map((label) => (
          <div
            key={label}
            className="px-2 py-2.5 text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-text-tertiary sm:px-md"
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
              type="button"
              onClick={() => onSelectDay(day)}
              className={cn(
                "relative flex min-h-[132px] flex-col border-b border-r border-border/50 p-2 text-left transition sm:min-h-[148px] sm:p-md",
                "hover:bg-background-tertiary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-primary",
                !inMonth && "bg-background-primary/40 text-text-tertiary",
                inMonth && "bg-background-secondary/50",
                isToday && "ring-1 ring-inset ring-accent-primary/35",
                dayState?.hasExams && "bg-[#D4537E]/[0.06]",
              )}
            >
              {hasWork ? (
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-0.5 rounded-b-sm",
                    dayState?.hasExams ? "bg-[#D4537E]" : "bg-accent-quaternary/85",
                  )}
                />
              ) : null}

              <div className="flex items-center justify-between gap-1">
                <span
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                    isToday
                      ? "bg-accent-primary text-background-primary"
                      : "text-text-primary",
                    !inMonth && "text-text-tertiary",
                  )}
                >
                  {day.getDate()}
                </span>
                {dayState?.hasExams ? (
                  <span className="rounded-md bg-[#D4537E]/12 px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-[#D4537E]">
                    Exam
                  </span>
                ) : isToday ? (
                  <span className="text-[0.6rem] uppercase tracking-[0.14em] text-accent-primary">
                    Today
                  </span>
                ) : null}
              </div>

              <div className="mt-2 flex flex-1 flex-col gap-1">
                {dayState?.hasScheduledTasks ? (
                  <p className="text-[0.62rem] font-medium text-accent-secondary">
                    {positionedTasks.length} block{positionedTasks.length === 1 ? "" : "s"} today
                  </p>
                ) : null}

                {deadlineItems.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="truncate rounded-md px-1.5 py-1 text-[0.65rem] font-medium leading-tight"
                    style={{
                      backgroundColor: item.backgroundColor,
                      color: item.color,
                    }}
                  >
                    {item.title}
                  </div>
                ))}

                {deadlineItems.length > 2 ? (
                  <p className="text-[0.62rem] text-text-tertiary">+{deadlineItems.length - 2} more</p>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
