"use client";

import { Check, Play, SkipForward } from "lucide-react";

import { categoryMeta } from "@/constants/schedule";
import { cn } from "@/lib/utils";
import type { PulseTask } from "@/store/scheduleStore";

type CalendarTaskCardProps = {
  task: PulseTask;
  height: number;
  interactive: boolean;
  compact: boolean;
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
  onStart: (id: string) => void;
};

type DensityTier = "micro" | "tight" | "compact" | "comfortable";

function tierForHeight(h: number): DensityTier {
  if (h < 40) return "micro";
  if (h < 56) return "tight";
  if (h < 80) return "compact";
  return "comfortable";
}

export function CalendarTaskCard({
  task,
  height,
  interactive,
  compact,
  onComplete,
  onSkip,
  onStart,
}: CalendarTaskCardProps) {
  const category = categoryMeta[task.category];
  const tier = tierForHeight(height);
  const laneCompact = compact;
  const durationMin = task.durationMinutes;
  const underOneHour = durationMin < 60;
  const veryShortDuration = durationMin <= 30;

  const timeLabel =
    height >= 48 ? `${task.scheduledTime} - ${task.endTime}` : task.scheduledTime;

  const showCourse = !underOneHour && tier !== "micro" && height >= (laneCompact ? 46 : 42);

  const showActions = interactive && !laneCompact && height >= 32;

  const mainPad = underOneHour
    ? "px-1.5 py-1"
    : tier === "micro"
      ? "px-2 py-1.5"
      : tier === "tight"
        ? "px-2 py-1.5"
        : tier === "compact"
          ? "px-2.5 py-2"
          : "px-3 py-2";

  const timeClass = cn(
    "shrink-0 truncate font-mono font-semibold uppercase tracking-[0.06em] text-text-tertiary",
    underOneHour && "text-[0.65rem] leading-tight",
    !underOneHour && tier === "micro" && "text-[0.55rem] leading-none",
    !underOneHour && tier === "tight" && "text-[0.58rem] leading-tight",
    !underOneHour && tier === "compact" && "text-[0.6rem] leading-tight",
    !underOneHour && tier === "comfortable" && "text-[0.62rem] leading-tight",
  );

  const titleClass = cn(
    "min-w-0 break-words font-semibold text-text-primary",
    underOneHour && "text-[0.75rem] leading-snug",
    !underOneHour && tier === "micro" && "text-[0.62rem] leading-[1.15]",
    !underOneHour && tier === "tight" && "text-[0.68rem] leading-snug",
    !underOneHour && tier === "compact" && "text-[0.72rem] leading-snug",
    !underOneHour && tier === "comfortable" && "text-[0.78rem] leading-4",
  );

  const courseClass = cn(
    "truncate text-text-secondary",
    tier === "micro" && "text-[0.58rem] leading-tight",
    tier === "tight" && "text-[0.62rem] leading-tight",
    tier === "compact" && "text-[0.65rem] leading-tight",
    tier === "comfortable" && "text-[0.68rem] leading-4",
  );

  const iconBtnClass =
    "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition hover:opacity-90";
  const textBtnClass = cn(
    "shrink-0 rounded-full border font-semibold uppercase transition",
    underOneHour && "px-1.5 py-0.5 text-[0.55rem] tracking-[0.06em]",
    !underOneHour && tier === "comfortable" && "px-2 py-1 text-[0.58rem] tracking-[0.1em]",
    !underOneHour && tier === "compact" && "px-1.5 py-0.5 text-[0.52rem] tracking-[0.08em]",
    !underOneHour && (tier === "tight" || tier === "micro") && "px-1.5 py-0.5 text-[0.5rem] tracking-[0.06em]",
  );

  /** ≤30 min: icon-only; ultra-narrow slot: hide actions until hover (fine pointer) */
  const actionsHoverOnly = veryShortDuration && height < 40;

  return (
    <article
      className={cn(
        "group flex h-full min-h-0 min-w-0 flex-row items-stretch overflow-hidden rounded-md border border-border bg-background-secondary shadow-none",
        task.status === "in_progress" &&
          "border-accent-primary/50 bg-accent-primary/8 ring-1 ring-inset ring-accent-primary/15",
      )}
      style={{
        borderLeftColor: category.color,
        borderLeftWidth: 3,
      }}
      title={`${task.scheduledTime} - ${task.endTime} · ${task.title}${task.courseName ? ` · ${task.courseName}` : ""}`}
    >
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 touch-pan-y flex-col gap-0.5 overflow-y-auto overflow-x-hidden overscroll-y-contain [scrollbar-width:thin]",
          mainPad,
        )}
      >
        <div className="flex min-w-0 items-start justify-between gap-1">
          <div className="min-w-0 flex-1">
            <p className={timeClass}>{timeLabel}</p>
            <p className={titleClass}>{task.title}</p>
          </div>

          {task.status === "in_progress" ? (
            laneCompact || tier === "micro" ? (
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent-primary" />
            ) : (
              <span
                className={cn(
                  "shrink-0 rounded-full bg-accent-primary/14 font-semibold uppercase text-accent-primary",
                  tier === "comfortable" ? "px-1.5 py-0.5 text-[0.58rem] tracking-[0.14em]" : "px-1 py-0.5 text-[0.52rem] tracking-[0.1em]",
                )}
              >
                Live
              </span>
            )
          ) : null}
        </div>

        {showCourse ? (
          <p className={courseClass}>{task.courseName ?? category.label}</p>
        ) : null}
      </div>

      {showActions ? (
        <div
          className={cn(
            "flex shrink-0 flex-row items-center gap-0.5 self-stretch border-l border-border/50 bg-background-secondary/90 py-1 pl-1 pr-1.5",
            veryShortDuration && "gap-0.5",
            actionsHoverOnly &&
              "opacity-0 transition-opacity duration-150 [pointer-events:none] group-hover:opacity-100 group-hover:[pointer-events:auto] group-focus-within:opacity-100 group-focus-within:[pointer-events:auto] max-md:opacity-100 max-md:[pointer-events:auto] motion-reduce:opacity-100 motion-reduce:[pointer-events:auto]",
          )}
          aria-label="Task actions"
        >
          {veryShortDuration ? (
            <>
              <button
                className={cn(iconBtnClass, "border-accent-primary/35 bg-accent-primary/10 text-accent-primary")}
                onClick={() => onStart(task.id)}
                title="Start"
                type="button"
              >
                <Play className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only">Start</span>
              </button>
              <button
                className={cn(iconBtnClass, "border-accent-secondary/35 bg-accent-secondary/10 text-accent-secondary")}
                onClick={() => onComplete(task.id)}
                title="Done"
                type="button"
              >
                <Check className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only">Done</span>
              </button>
              <button
                className={cn(iconBtnClass, "border-accent-tertiary/35 bg-accent-tertiary/10 text-accent-tertiary")}
                onClick={() => onSkip(task.id)}
                title="Skip"
                type="button"
              >
                <SkipForward className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only">Skip</span>
              </button>
            </>
          ) : (
            <>
              <button
                className={cn(textBtnClass, "border-accent-primary/30 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/16")}
                onClick={() => onStart(task.id)}
                type="button"
              >
                Start
              </button>
              <button
                className={cn(textBtnClass, "border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary hover:bg-accent-secondary/16")}
                onClick={() => onComplete(task.id)}
                type="button"
              >
                Done
              </button>
              <button
                className={cn(textBtnClass, "border-accent-tertiary/30 bg-accent-tertiary/10 text-accent-tertiary hover:bg-accent-tertiary/16")}
                onClick={() => onSkip(task.id)}
                type="button"
              >
                Skip
              </button>
            </>
          )}
        </div>
      ) : null}
    </article>
  );
}
