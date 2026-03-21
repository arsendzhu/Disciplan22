"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import {
  categoryMeta,
  priorityMeta,
  ScheduleCategory,
  taskCategories,
  taskLabels,
  TaskLabel,
  TaskPriority,
} from "@/constants/schedule";
import { findScheduleSuggestions } from "@/lib/schedule-logic";
import { cn } from "@/lib/utils";
import { useScheduleStore } from "@/store/scheduleStore";
import { useUserStore } from "@/store/userStore";

import { BodyText } from "../ui/BodyText";
import { GhostButton } from "../ui/GhostButton";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SectionTitle } from "../ui/SectionTitle";

type AddTaskSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function AddTaskSheet({ open, onClose }: AddTaskSheetProps) {
  const tasks = useScheduleStore((state) => state.tasks);
  const createTaskFromInput = useScheduleStore((state) => state.createTaskFromInput);
  const peakWindow = useUserStore((state) => state.profile.peakEnergyWindow);
  const [title, setTitle] = useState("");
  const [courseName, setCourseName] = useState("");
  const [category, setCategory] = useState<ScheduleCategory>("assignment");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [priority, setPriority] = useState<TaskPriority>("important");
  const [labels, setLabels] = useState<TaskLabel[]>([]);
  const [dueAt, setDueAt] = useState("2026-03-24T17:00");
  const [manualMode, setManualMode] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [implementationIntention, setImplementationIntention] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setCourseName("");
      setCategory("assignment");
      setDurationMinutes(60);
      setPriority("important");
      setLabels([]);
      setDueAt("2026-03-24T17:00");
      setManualMode(false);
      setScheduledTime("10:00");
      setEndTime("11:00");
      setImplementationIntention("");
      setSelectedSuggestion(0);
    }
  }, [open]);

  const suggestions = useMemo(
    () =>
      findScheduleSuggestions({
        tasks,
        category,
        durationMinutes,
        peakWindow,
        energyLevel: categoryMeta[category].energy,
      }),
    [category, durationMinutes, peakWindow, tasks],
  );

  if (!open) return null;

  const effectiveStart = manualMode ? scheduledTime : suggestions[selectedSuggestion]?.start ?? scheduledTime;
  const effectiveEnd = manualMode ? endTime : suggestions[selectedSuggestion]?.end ?? endTime;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 px-lg py-lg backdrop-blur-md">
      <div className="w-full max-w-[880px] rounded-[28px] border border-border bg-background-secondary p-xl shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
        <div className="mb-lg flex items-start justify-between gap-md">
          <div>
            <SectionTitle>Add task</SectionTitle>
            <BodyText>Quick capture, category selection, and scheduling in one place.</BodyText>
          </div>
          <button
            className="rounded-full border border-border p-2 text-text-tertiary transition hover:border-accent-primary/35 hover:text-accent-primary"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-lg lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-lg">
            <label className="block space-y-sm">
              <span className="font-display text-lg text-text-primary">What do you need to do?</span>
              <input
                className="w-full rounded-lg border border-border bg-background-tertiary px-lg py-md text-base text-text-primary outline-none focus:border-accent-primary"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Finish the CS assignment by Thursday 5PM"
                value={title}
              />
            </label>

            <div className="space-y-sm">
              <span className="text-xs uppercase tracking-[0.22em] text-text-tertiary">Category</span>
              <div className="flex flex-wrap gap-sm">
                {taskCategories.map((item) => {
                  const meta = categoryMeta[item];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={item}
                      className={cn(
                        "inline-flex items-center gap-sm rounded-full border px-md py-sm text-sm transition",
                        category === item
                          ? "border-accent-primary bg-accent-primary/10 text-text-primary"
                          : "border-border text-text-secondary hover:border-accent-primary/35",
                      )}
                      onClick={() => setCategory(item)}
                      type="button"
                    >
                      <Icon className="h-4 w-4" />
                      {meta.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-md sm:grid-cols-2">
              <label className="space-y-sm">
                <span className="text-xs uppercase tracking-[0.22em] text-text-tertiary">Course</span>
                <input
                  className="w-full rounded-lg border border-border bg-background-tertiary px-lg py-md text-text-primary outline-none focus:border-accent-primary"
                  onChange={(event) => setCourseName(event.target.value)}
                  placeholder="CS 3550"
                  value={courseName}
                />
              </label>
              <label className="space-y-sm">
                <span className="text-xs uppercase tracking-[0.22em] text-text-tertiary">Duration</span>
                <select
                  className="w-full rounded-lg border border-border bg-background-tertiary px-lg py-md text-text-primary outline-none focus:border-accent-primary"
                  onChange={(event) => setDurationMinutes(Number(event.target.value))}
                  value={durationMinutes}
                >
                  {[15, 30, 45, 60, 80, 90, 96, 120, 180, 240].map((value) => (
                    <option key={value} value={value}>
                      {value} minutes
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-md sm:grid-cols-2">
              <label className="space-y-sm">
                <span className="text-xs uppercase tracking-[0.22em] text-text-tertiary">Priority</span>
                <select
                  className="w-full rounded-lg border border-border bg-background-tertiary px-lg py-md text-text-primary outline-none focus:border-accent-primary"
                  onChange={(event) => setPriority(event.target.value as TaskPriority)}
                  value={priority}
                >
                  {(Object.keys(priorityMeta) as TaskPriority[]).map((value) => (
                    <option key={value} value={value}>
                      {priorityMeta[value].label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-sm">
                <span className="text-xs uppercase tracking-[0.22em] text-text-tertiary">Due date</span>
                <input
                  className="w-full rounded-lg border border-border bg-background-tertiary px-lg py-md text-text-primary outline-none focus:border-accent-primary"
                  onChange={(event) => setDueAt(event.target.value)}
                  type="datetime-local"
                  value={dueAt}
                />
              </label>
            </div>

            <div className="space-y-sm">
              <span className="text-xs uppercase tracking-[0.22em] text-text-tertiary">Labels</span>
              <div className="flex flex-wrap gap-sm">
                {taskLabels.map((label) => {
                  const active = labels.includes(label);
                  return (
                    <button
                      key={label}
                      className={cn(
                        "rounded-full border px-md py-sm text-xs transition",
                        active
                          ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                          : "border-border text-text-secondary hover:border-accent-primary/35",
                      )}
                      onClick={() =>
                        setLabels((current) =>
                          current.includes(label)
                            ? current.filter((item) => item !== label)
                            : [...current, label],
                        )
                      }
                      type="button"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block space-y-sm">
              <span className="text-xs uppercase tracking-[0.22em] text-text-tertiary">Implementation intention</span>
              <textarea
                className="min-h-[96px] w-full rounded-lg border border-border bg-background-tertiary px-lg py-md text-text-primary outline-none focus:border-accent-primary"
                onChange={(event) => setImplementationIntention(event.target.value)}
                placeholder="When I sit down at the library at 10AM, I will open my CS assignment and write the first function."
                value={implementationIntention}
              />
            </label>
          </div>

          <div className="space-y-lg">
            <div className="rounded-xl border border-border bg-background-tertiary/70 p-lg">
              <div className="mb-md flex gap-sm">
                <button
                  className={cn(
                    "rounded-full px-md py-sm text-xs uppercase tracking-[0.2em]",
                    !manualMode ? "bg-accent-primary/12 text-accent-primary" : "text-text-tertiary",
                  )}
                  onClick={() => setManualMode(false)}
                  type="button"
                >
                  Schedule it for me
                </button>
                <button
                  className={cn(
                    "rounded-full px-md py-sm text-xs uppercase tracking-[0.2em]",
                    manualMode ? "bg-accent-primary/12 text-accent-primary" : "text-text-tertiary",
                  )}
                  onClick={() => setManualMode(true)}
                  type="button"
                >
                  Pick my time
                </button>
              </div>

              {!manualMode ? (
                <div className="space-y-md">
                  <BodyText>Finding the best time for this task using your chronotype and current task load.</BodyText>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.start}-${suggestion.end}`}
                      className={cn(
                        "w-full rounded-lg border p-md text-left transition",
                        selectedSuggestion === index
                          ? "border-accent-primary bg-accent-primary/10"
                          : "border-border hover:border-accent-primary/35",
                      )}
                      onClick={() => setSelectedSuggestion(index)}
                      type="button"
                    >
                      <p className="font-mono text-sm text-accent-primary">
                        Scheduled: {suggestion.start}-{suggestion.end}
                      </p>
                      <BodyText>{suggestion.reason}</BodyText>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid gap-md sm:grid-cols-2">
                  <label className="space-y-sm">
                    <span className="text-xs uppercase tracking-[0.22em] text-text-tertiary">Start time</span>
                    <input
                      className="w-full rounded-lg border border-border bg-background-secondary px-lg py-md text-text-primary outline-none focus:border-accent-primary"
                      onChange={(event) => setScheduledTime(event.target.value)}
                      type="time"
                      value={scheduledTime}
                    />
                  </label>
                  <label className="space-y-sm">
                    <span className="text-xs uppercase tracking-[0.22em] text-text-tertiary">End time</span>
                    <input
                      className="w-full rounded-lg border border-border bg-background-secondary px-lg py-md text-text-primary outline-none focus:border-accent-primary"
                      onChange={(event) => setEndTime(event.target.value)}
                      type="time"
                      value={endTime}
                    />
                  </label>
                  <div className="sm:col-span-2 rounded-lg border border-accent-primary/30 bg-accent-primary/8 p-md">
                    <BodyText>
                      Heads up: {categoryMeta[category].energy === "high"
                        ? "high-load tasks are strongest in your peak window."
                        : "manual scheduling is always allowed, but DisciPlan still nudges you toward lower-friction windows."}
                    </BodyText>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-background-tertiary/70 p-lg">
              <p className="mb-sm text-xs uppercase tracking-[0.22em] text-text-tertiary">Preview</p>
              <p className="text-lg font-semibold text-text-primary">{title || "Your new task"}</p>
              <BodyText>
                {manualMode
                  ? `Manual slot: ${scheduledTime}-${endTime}`
                  : suggestions[selectedSuggestion]
                    ? `${suggestions[selectedSuggestion].start}-${suggestions[selectedSuggestion].end} · ${suggestions[selectedSuggestion].zone} zone`
                    : "Pick a time to continue."}
              </BodyText>
            </div>

            <div className="flex flex-wrap gap-sm">
              <PrimaryButton
                onClick={() => {
                  if (!title.trim()) return;
                  createTaskFromInput({
                    title,
                    category,
                    courseName,
                    durationMinutes,
                    priority,
                    labels,
                    dueAt: new Date(dueAt).toISOString(),
                    scheduledTime: effectiveStart,
                    endTime: effectiveEnd,
                    implementationIntention,
                  });
                  onClose();
                }}
                title="Add to schedule"
              />
              <GhostButton onClick={onClose} title="Cancel" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
