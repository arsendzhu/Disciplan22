"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import type { CalendarRange } from "../_lib/calendar-helpers";
import { RANGE_META } from "../_lib/calendar-helpers";

import { BodyText } from "@/components/ui/BodyText";

type CalendarToolbarProps = {
  title: string;
  range: CalendarRange;
  onRangeChange: (range: CalendarRange) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export function CalendarToolbar({
  title,
  range,
  onRangeChange,
  onPrev,
  onNext,
  onToday,
}: CalendarToolbarProps) {
  return (
    <div className="flex flex-col gap-lg border-b border-border/60 pb-lg sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-md">
      <div className="min-w-0 space-y-sm">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-primary">Calendar</p>
        <h2 className="font-display text-[clamp(1.45rem,1.15rem+0.75vw,1.85rem)] leading-tight text-text-primary">
          {title}
        </h2>
        <BodyText className="max-w-xl text-sm">
          Schedule blocks on the grid, scan Canvas deadlines in the day strip, and switch between day,
          multi-day, and month views.
        </BodyText>
      </div>

      <div className="flex flex-col gap-sm sm:items-end">
        <div
          className="flex w-full items-center justify-between gap-xs rounded-xl border border-border bg-background-tertiary/50 p-1 sm:w-auto"
          role="group"
          aria-label="Navigate dates"
        >
          <button
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-tertiary transition hover:bg-background-secondary hover:text-text-primary"
            onClick={onPrev}
            type="button"
            aria-label="Previous range"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="min-w-[5.5rem] rounded-lg border border-transparent px-sm py-1.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-text-primary transition hover:border-border hover:bg-background-secondary"
            onClick={onToday}
            type="button"
          >
            Today
          </button>
          <button
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-tertiary transition hover:bg-background-secondary hover:text-text-primary"
            onClick={onNext}
            type="button"
            aria-label="Next range"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div
          className="flex w-full flex-wrap gap-1 rounded-xl border border-border bg-background-tertiary/50 p-1 sm:w-auto"
          role="tablist"
          aria-label="Calendar range"
        >
          {RANGE_META.map((item) => {
            const active = range === item.value;
            return (
              <button
                key={item.value}
                role="tab"
                aria-selected={active}
                className={cn(
                  "rounded-lg px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition sm:px-md",
                  active
                    ? "bg-accent-primary/14 text-accent-primary"
                    : "text-text-tertiary hover:bg-background-secondary/80 hover:text-text-primary",
                )}
                onClick={() => onRangeChange(item.value)}
                type="button"
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
