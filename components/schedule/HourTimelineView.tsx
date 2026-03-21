"use client";

import { toMinutes } from "@/lib/schedule-logic";
import { PulseTask } from "@/store/scheduleStore";

import { TaskBlock } from "./TaskBlock";
import { Card } from "../ui/Card";

const hours = Array.from({ length: 14 }, (_, index) => 7 + index);
const startMinute = 7 * 60;
const pixelsPerMinute = 1.35;

export function HourTimelineView({ tasks }: { tasks: PulseTask[] }) {
  const totalHeight = hours.length * 60 * pixelsPerMinute;
  const now = new Date();
  const currentLine = (now.getHours() * 60 + now.getMinutes() - startMinute) * pixelsPerMinute;

  return (
    <Card className="overflow-hidden p-0">
      <div className="grid grid-cols-[88px_minmax(0,1fr)]">
        <div className="border-r border-border/60 bg-background-tertiary/70">
          {hours.map((hour) => (
            <div
              key={hour}
              className="border-b border-border/40 px-md py-md text-xs uppercase tracking-[0.18em] text-text-tertiary"
              style={{ height: `${60 * pixelsPerMinute}px` }}
            >
              {`${hour.toString().padStart(2, "0")}:00`}
            </div>
          ))}
        </div>
        <div className="relative" style={{ height: `${totalHeight}px` }}>
          {hours.map((hour, index) => (
            <div
              key={hour}
              className="absolute inset-x-0 border-b border-border/40"
              style={{ top: `${index * 60 * pixelsPerMinute}px` }}
            />
          ))}
          {currentLine > 0 && currentLine < totalHeight ? (
            <div
              className="absolute inset-x-0 z-20 border-t border-accent-primary/70 shadow-[0_0_18px_rgba(232,201,122,0.35)]"
              style={{ top: `${currentLine}px` }}
            />
          ) : null}
          {tasks.map((task) => {
            const top = (toMinutes(task.scheduledTime) - startMinute) * pixelsPerMinute;
            const height = Math.max(task.durationMinutes * pixelsPerMinute, 84);

            return (
              <div
                key={task.id}
                className="absolute left-4 right-4 z-10"
                style={{ height: `${height}px`, top: `${Math.max(top, 0)}px` }}
              >
                <TaskBlock compact={height < 104} task={task} />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
