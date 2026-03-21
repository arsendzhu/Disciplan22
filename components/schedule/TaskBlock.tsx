"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GripVertical,
  RotateCcw,
  SkipForward,
} from "lucide-react";

import { categoryMeta, labelMeta, priorityMeta } from "@/constants/schedule";
import { addMinutes, describeDue, getDueTone } from "@/lib/schedule-logic";
import { cn, formatDuration } from "@/lib/utils";
import { useNPCStore } from "@/store/npcStore";
import { PulseTask, useScheduleStore } from "@/store/scheduleStore";

type TaskBlockProps = {
  task: PulseTask;
  compact?: boolean;
};

export function TaskBlock({ task, compact = false }: TaskBlockProps) {
  const [expanded, setExpanded] = useState(!compact && task.status === "in_progress");
  const completeTask = useScheduleStore((state) => state.completeTask);
  const skipTask = useScheduleStore((state) => state.skipTask);
  const rescheduleTask = useScheduleStore((state) => state.rescheduleTask);
  const startTask = useScheduleStore((state) => state.startTask);
  const celebrateTaskCompletion = useNPCStore((state) => state.celebrateTaskCompletion);

  const category = categoryMeta[task.category];
  const priority = priorityMeta[task.priority];
  const Icon = category.icon;
  const dueTone = getDueTone(task.dueAt);
  const isOverdue = describeDue(task.dueAt) === "Overdue";

  const visibleLabels = useMemo(() => task.labels.slice(0, 2), [task.labels]);
  const extraLabels = task.labels.length - visibleLabels.length;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-background-secondary/95 transition duration-200",
        task.status === "completed" && "scale-[0.98] opacity-50",
        task.status === "in_progress" &&
          "bg-[linear-gradient(135deg,rgba(232,201,122,0.04),rgba(26,25,22,0.98))]",
        isOverdue && "shadow-[-6px_0_24px_rgba(212,83,126,0.16)]",
      )}
    >
      <div className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: isOverdue ? "#D4537E" : category.color }} />
      <div className="space-y-sm px-lg py-md pl-[22px]">
        <div className="flex flex-wrap items-start justify-between gap-md">
          <div className="flex min-w-0 flex-1 items-start gap-sm">
            <span
              className="mt-[6px] h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: priority.color }}
            />
            <Icon className="mt-[2px] h-4 w-4 shrink-0 text-text-secondary" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-md">
                <h3
                  className={cn(
                    "line-clamp-2 text-sm font-semibold text-text-primary",
                    task.status === "completed" && "line-through",
                  )}
                >
                  {task.title}
                </h3>
                <div className="flex shrink-0 items-center gap-sm">
                  {task.status === "in_progress" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-tertiary/12 px-2 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-accent-tertiary">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-tertiary animate-pulse" />
                      Live
                    </span>
                  ) : null}
                  {isOverdue ? (
                    <span className="rounded-full bg-[#D4537E]/10 px-2 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-[#D4537E]">
                      Overdue
                    </span>
                  ) : null}
                  <span className="font-mono text-[0.72rem] uppercase tracking-[0.15em] text-text-tertiary">
                    {formatDuration(task.durationMinutes)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-md">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-sm">
            <span className="truncate text-xs text-text-secondary">
              {task.courseName ?? category.label}
            </span>
            <span className={cn("text-xs", dueTone)}>{describeDue(task.dueAt)}</span>
            <div className="flex flex-wrap items-center gap-xs">
              {visibleLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full px-2 py-1 text-[0.62rem] font-medium"
                  style={{
                    backgroundColor: `${labelMeta[label].color}26`,
                    color: labelMeta[label].color,
                  }}
                >
                  {label}
                </span>
              ))}
              {extraLabels > 0 ? (
                <span className="rounded-full bg-background-tertiary px-2 py-1 text-[0.62rem] text-text-tertiary">
                  +{extraLabels} more
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-xs">
            <button
              className="rounded-full border border-border p-1.5 text-text-tertiary transition hover:border-accent-primary/40 hover:text-accent-primary"
              onClick={() => startTask(task.id)}
              title="Start task"
              type="button"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </button>
            <button
              className="rounded-full border border-accent-secondary/30 bg-accent-secondary/10 p-1.5 text-accent-secondary transition hover:scale-105"
              onClick={() => {
                completeTask(task.id);
                celebrateTaskCompletion();
              }}
              title="Complete task"
              type="button"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              className="rounded-full border border-accent-tertiary/30 bg-accent-tertiary/10 p-1.5 text-accent-tertiary transition hover:scale-105"
              onClick={() => skipTask(task.id)}
              title="Skip task"
              type="button"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {task.category === "project_milestone" && typeof task.progress === "number" ? (
          <div className="space-y-1">
            <div className="h-[3px] w-full rounded-full bg-border">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.round(task.progress * 100)}%`, backgroundColor: category.color }}
              />
            </div>
            <p className="text-[0.65rem] text-text-tertiary">
              {Math.round(task.progress * 5)} of 5 sub-tasks done
            </p>
          </div>
        ) : null}

        {!compact ? (
          <button
            className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.2em] text-text-tertiary transition hover:text-accent-primary"
            onClick={() => setExpanded((value) => !value)}
            type="button"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {expanded ? "Hide details" : "Expand"}
          </button>
        ) : null}

        {expanded ? (
          <div className="space-y-sm rounded-md border border-border/60 bg-background-tertiary/65 p-md">
            <div className="flex flex-wrap items-center gap-sm">
              <span className="rounded-full px-2 py-1 text-[0.65rem] uppercase tracking-[0.16em]" style={{ backgroundColor: category.tint, color: category.color }}>
                {category.defaultTechnique}
              </span>
              <span className="rounded-full border border-border px-2 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-text-secondary">
                {task.energyRequired} energy
              </span>
              <span className="rounded-full border border-border px-2 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-text-secondary">
                {priority.label}
              </span>
            </div>
            {task.implementationIntention ? (
              <p className="text-sm italic text-text-secondary">
                &quot;{task.implementationIntention}&quot;
              </p>
            ) : (
              <p className="text-sm text-text-tertiary">Set an implementation intention to reduce startup resistance.</p>
            )}
            <p className="text-sm text-text-secondary">{task.notes}</p>
            <div className="flex flex-wrap items-center gap-sm">
              <button
                className="inline-flex items-center gap-2 rounded-full border border-accent-primary/35 bg-accent-primary/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-accent-primary"
                onClick={() =>
                  rescheduleTask(
                    task.id,
                    addMinutes(task.scheduledTime, 30),
                    addMinutes(task.scheduledTime, 30 + task.durationMinutes),
                  )
                }
                type="button"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reschedule
              </button>
              {task.labels.includes("@canvas") ? (
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-text-secondary hover:border-accent-primary/35 hover:text-accent-primary"
                  href="#"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Canvas link
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
