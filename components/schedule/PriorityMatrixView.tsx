"use client";

import { groupTasksForMatrix } from "@/lib/schedule-logic";
import { PulseTask } from "@/store/scheduleStore";

import { TaskBlock } from "./TaskBlock";

const quadrantMeta = {
  do_now: {
    label: "Do now",
    tint: "bg-[#D4537E]/8",
  },
  schedule: {
    label: "Schedule",
    tint: "bg-accent-quaternary/8",
  },
  batch: {
    label: "Batch",
    tint: "bg-background-tertiary/70",
  },
  drop: {
    label: "Drop",
    tint: "bg-white/[0.02]",
  },
} as const;

export function PriorityMatrixView({ tasks }: { tasks: PulseTask[] }) {
  const groups = groupTasksForMatrix(tasks);

  return (
    <div className="grid gap-md lg:grid-cols-2">
      {(Object.keys(quadrantMeta) as Array<keyof typeof quadrantMeta>).map((key) => (
        <section
          key={key}
          className={`rounded-xl border border-border p-lg ${quadrantMeta[key].tint}`}
        >
          <p className="mb-md font-mono text-xs uppercase tracking-[0.22em] text-accent-primary">
            {quadrantMeta[key].label}
          </p>
          <div className="space-y-md">
            {groups[key].map((task) => (
              <TaskBlock key={task.id} compact task={task} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
