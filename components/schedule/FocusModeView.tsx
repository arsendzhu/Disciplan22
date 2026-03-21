"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { PulseTask, useScheduleStore } from "@/store/scheduleStore";

import { BodyText } from "../ui/BodyText";
import { PrimaryButton } from "../ui/PrimaryButton";
import { GhostButton } from "../ui/GhostButton";

const defaultMinutes = 90;

export function FocusModeView({ tasks }: { tasks: PulseTask[] }) {
  const activeTask = useMemo(
    () => tasks.find((task) => task.status === "in_progress") ?? tasks.find((task) => task.status === "pending") ?? tasks[0],
    [tasks],
  );
  const completeTask = useScheduleStore((state) => state.completeTask);
  const startTask = useScheduleStore((state) => state.startTask);
  const [secondsRemaining, setSecondsRemaining] = useState(defaultMinutes * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running]);

  const minutes = Math.floor(secondsRemaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsRemaining % 60).toString().padStart(2, "0");
  const progress = 1 - secondsRemaining / (defaultMinutes * 60);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  if (!activeTask) return null;

  return (
    <div className="rounded-[32px] border border-border bg-background-primary p-xxl text-center shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
      <p className="mb-sm font-display text-[clamp(1.6rem,1.4rem+1vw,2.2rem)] text-text-primary">{activeTask.title}</p>
      <BodyText className="mb-xl">Due {new Date(activeTask.dueAt).toLocaleString()}</BodyText>
      <div className="mx-auto mb-xl flex h-[260px] w-[260px] items-center justify-center">
        <svg className="h-[220px] w-[220px] -rotate-90" viewBox="0 0 220 220">
          <circle cx="110" cy="110" fill="none" r={radius} stroke="rgba(42,39,36,1)" strokeWidth="14" />
          <motion.circle
            animate={{ strokeDashoffset: circumference * progress }}
            cx="110"
            cy="110"
            fill="none"
            r={radius}
            stroke="var(--accent-primary)"
            strokeDasharray={circumference}
            strokeLinecap="round"
            strokeWidth="14"
            transition={{ duration: 0.4 }}
          />
        </svg>
        <div className="absolute text-center">
          <p className="font-mono text-4xl tracking-[0.16em] text-text-primary">
            {minutes}:{seconds}
          </p>
          <p className="mt-sm text-xs uppercase tracking-[0.22em] text-accent-primary">
            {running ? "Deep in flow" : "Ready to focus"}
          </p>
        </div>
      </div>

      <BodyText className="mx-auto mb-xl max-w-[34rem] italic">
        {activeTask.implementationIntention ??
          "When I sit down, I will open the task immediately and begin with the next concrete action."}
      </BodyText>

      <div className="flex flex-wrap justify-center gap-sm">
        <PrimaryButton
          onClick={() => {
            startTask(activeTask.id);
            setRunning(true);
          }}
          title={running ? "Running" : "Start session"}
        />
        <GhostButton onClick={() => setRunning(false)} title="Pause" />
        <GhostButton
          onClick={() => {
            setRunning(false);
            setSecondsRemaining(defaultMinutes * 60);
            completeTask(activeTask.id);
          }}
          title="End session"
        />
      </div>
    </div>
  );
}
