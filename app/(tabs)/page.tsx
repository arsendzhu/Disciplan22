"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

import { DailyInsightCard } from "@/components/insights/DailyInsightCard";
import { MoodCheckIn } from "@/components/insights/MoodCheckIn";
import { NPCCharacter } from "@/components/npc/NPCCharacter";
import { NPCMoodBadge } from "@/components/npc/NPCMoodBadge";
import { NPCRoom } from "@/components/npc/NPCRoom";
import { BodyText } from "@/components/ui/BodyText";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useInsight } from "@/hooks/useInsight";
import { useNPCState } from "@/hooks/useNPCState";
import { useSchedule } from "@/hooks/useSchedule";
import { getGreeting } from "@/lib/utils";
import { GhostButton } from "@/components/ui/GhostButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useScheduleStore } from "@/store/scheduleStore";

export default function HomePage() {
  const router = useRouter();
  const insight = useInsight();
  const { stats, nextTask } = useSchedule();
  const { currentState, streakDays } = useNPCState();
  const startTask = useScheduleStore((state) => state.startTask);
  const setPreferredLayout = useScheduleStore((state) => state.setPreferredLayout);
  const resetDemo = useScheduleStore((state) => state.resetDemo);

  return (
    <div className="space-y-xl pb-[88px] lg:pb-0">
      <div className="flex flex-wrap items-start justify-between gap-lg">
        <div>
          <p className="font-display text-[clamp(2rem,1.4rem+2vw,3rem)] text-text-primary">
            {getGreeting()}, Alex <span className="text-accent-primary">✦</span>
          </p>
          <BodyText>HackHayward demo mode is loaded with a real-feeling student week.</BodyText>
        </div>
        <Chip label={`streak: 🔥 ${streakDays}`} />
      </div>

      <div className="page-grid">
        <div className="space-y-lg">
          <NPCRoom state={currentState}>
            <NPCCharacter state={currentState} />
          </NPCRoom>
          <NPCMoodBadge state={currentState} />
          <DailyInsightCard insight={insight.insight} />
        </div>

        <div className="space-y-lg">
          <Card>
            <SectionTitle>Quick stats</SectionTitle>
            <div className="grid gap-md sm:grid-cols-3">
              <div className="rounded-lg border border-border/60 bg-background-tertiary/75 p-lg">
                <p className="font-mono text-lg text-accent-primary">{stats.taskCount}</p>
                <BodyText>tasks today</BodyText>
              </div>
              <div className="rounded-lg border border-border/60 bg-background-tertiary/75 p-lg">
                <p className="font-mono text-lg text-accent-primary">{stats.focusHours}hr</p>
                <BodyText>focus</BodyText>
              </div>
              <div className="rounded-lg border border-border/60 bg-background-tertiary/75 p-lg">
                <p className="font-mono text-lg text-accent-primary">{stats.sleepHours}hrs</p>
                <BodyText>sleep</BodyText>
              </div>
            </div>
          </Card>

          <MoodCheckIn />

          <Card>
            <div className="mb-md flex items-center gap-sm">
              <Sparkles className="h-4 w-4 text-accent-primary" />
              <SectionTitle className="mb-0">Next task</SectionTitle>
            </div>
            <p className="mb-sm text-lg font-bold text-text-primary">{nextTask?.title ?? "Nothing queued yet"}</p>
            <BodyText>
              {nextTask ? `${nextTask.courseName} · ${nextTask.scheduledTime}` : "Take a breath before you add more."}
            </BodyText>
            <div className="mt-md flex flex-wrap gap-sm">
              <PrimaryButton
                onClick={() => {
                  if (!nextTask) return;
                  startTask(nextTask.id);
                  setPreferredLayout("focus");
                  router.push("/today");
                }}
                title={nextTask ? "Start focus block" : "No task ready"}
              />
              <GhostButton
                onClick={() => {
                  resetDemo();
                  router.push("/today");
                }}
                title="Reset demo week"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
