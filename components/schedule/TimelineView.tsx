import { PulseTask } from "@/store/scheduleStore";

import { TaskBlock } from "./TaskBlock";

export function TimelineView({ tasks }: { tasks: PulseTask[] }) {
  return (
    <div className="space-y-md">
      {tasks.map((task) => (
        <TaskBlock key={task.id} task={task} />
      ))}
    </div>
  );
}
