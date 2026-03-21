"use client";

import { groupTasksForBoard } from "@/lib/schedule-logic";
import { PulseTask } from "@/store/scheduleStore";

import { TaskBlock } from "./TaskBlock";
import { Card } from "../ui/Card";

export function KanbanBoardView({ tasks }: { tasks: PulseTask[] }) {
  const groups = groupTasksForBoard(tasks);

  return (
    <div className="grid gap-md xl:grid-cols-4">
      {[
        { key: "today", label: "Today" },
        { key: "inFocus", label: "In focus" },
        { key: "done", label: "Done" },
        { key: "later", label: "This week" },
      ].map(({ key, label }) => (
        <Card key={key} className="space-y-md">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-primary">{label}</p>
          <div className="space-y-md">
            {groups[key as keyof typeof groups].map((task: PulseTask) => (
              <TaskBlock key={task.id} compact task={task} />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
