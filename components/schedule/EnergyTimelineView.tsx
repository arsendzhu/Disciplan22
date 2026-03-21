"use client";

import { categoryMeta } from "@/constants/schedule";
import { buildCognitiveCurve, getEnergyZone } from "@/lib/schedule-logic";
import { PulseTask } from "@/store/scheduleStore";
import { PeakEnergyWindow } from "@/store/userStore";

import { CognitiveLoadBar } from "./CognitiveLoadBar";
import { TaskBlock } from "./TaskBlock";
import { BodyText } from "../ui/BodyText";

type Zone = "peak" | "secondary" | "trough" | "recovery";

const zoneMeta: Record<
  Zone,
  { label: string; background: string; description: string }
> = {
  peak: {
    label: "Peak zone",
    background: "bg-accent-primary/7",
    description: "Hardest cognitive work belongs here.",
  },
  recovery: {
    label: "Recovery break",
    background: "bg-accent-secondary/7",
    description: "Mandatory reset so the next block still feels sharp.",
  },
  secondary: {
    label: "Secondary zone",
    background: "bg-accent-quaternary/7",
    description: "Strong follow-up work, review, and structured assignments.",
  },
  trough: {
    label: "Trough zone",
    background: "bg-white/0",
    description: "Low-load admin and life maintenance go here.",
  },
};

export function EnergyTimelineView({
  tasks,
  peakWindow,
}: {
  tasks: PulseTask[];
  peakWindow: PeakEnergyWindow;
}) {
  const groups = tasks.reduce<Record<Zone, PulseTask[]>>(
    (accumulator, task) => {
      const zone =
        task.category === "self_care"
          ? "recovery"
          : getEnergyZone(task.scheduledTime, peakWindow);
      accumulator[zone].push(task);
      return accumulator;
    },
    { peak: [], recovery: [], secondary: [], trough: [] },
  );

  return (
    <div className="space-y-lg">
      <CognitiveLoadBar curve={buildCognitiveCurve(peakWindow)} peakWindow={peakWindow} />
      {(Object.keys(groups) as Zone[]).map((zone) => (
        <section key={zone} className={`rounded-xl border border-border p-lg ${zoneMeta[zone].background}`}>
          <div className="mb-md">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-primary">
              {zoneMeta[zone].label}
            </p>
            <BodyText>{zoneMeta[zone].description}</BodyText>
          </div>
          <div className="space-y-md">
            {groups[zone].length ? (
              groups[zone].map((task) => <TaskBlock key={task.id} task={task} />)
            ) : (
              <div className="rounded-lg border border-dashed border-border px-lg py-lg">
                <BodyText>
                  No {zoneMeta[zone].label.toLowerCase()} tasks yet. Add one to let Pulse place it with the right cognitive weight.
                </BodyText>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
