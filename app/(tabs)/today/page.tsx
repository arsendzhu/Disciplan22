"use client";

import { useMemo, useState } from "react";

import { CanvasDueSoon } from "@/components/canvas/CanvasDueSoon";
import { AddTaskSheet } from "@/components/schedule/AddTaskSheet";
import { BreakCard } from "@/components/schedule/BreakCard";
import { EnergyTimelineView } from "@/components/schedule/EnergyTimelineView";
import { FocusModeView } from "@/components/schedule/FocusModeView";
import { TodayCalendar } from "./_components/TodayCalendar";
import { InterleavingSuggestionCard } from "@/components/schedule/InterleavingSuggestionCard";
import { KanbanBoardView } from "@/components/schedule/KanbanBoardView";
import { LayoutSwitcher } from "@/components/schedule/LayoutSwitcher";
import { PriorityMatrixView } from "@/components/schedule/PriorityMatrixView";
import { BodyText } from "@/components/ui/BodyText";
import { Card } from "@/components/ui/Card";
import { GhostButton } from "@/components/ui/GhostButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useSchedule } from "@/hooks/useSchedule";
import {
  findScheduleSuggestions,
  getLayoutIntro,
  shouldSuggestInterleaving,
} from "@/lib/schedule-logic";
import { useScheduleStore } from "@/store/scheduleStore";
import { useUserStore } from "@/store/userStore";

export default function TodayPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [interleavingDismissed, setInterleavingDismissed] = useState(false);
  const { tasks, preferredLayout, stats } = useSchedule();
  const peakWindow = useUserStore((state) => state.profile.peakEnergyWindow);
  const createTaskFromInput = useScheduleStore((state) => state.createTaskFromInput);
  const setPreferredLayout = useScheduleStore((state) => state.setPreferredLayout);

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date()),
    [],
  );

  const interleaving = useMemo(
    () =>
      shouldSuggestInterleaving(
        [...tasks]
          .filter((task) => task.status !== "completed")
          .sort((left, right) => left.scheduledTime.localeCompare(right.scheduledTime)),
      ),
    [tasks],
  );

  const quickWinTasks = useMemo(
    () => tasks.filter((task) => task.labels.includes("@quick-win") && task.status !== "completed"),
    [tasks],
  );

  const layoutContent = (() => {
    switch (preferredLayout) {
      case "energy":
        return <EnergyTimelineView peakWindow={peakWindow} tasks={tasks} />;
      case "timeline":
        return <TodayCalendar tasks={tasks} />;
      case "board":
        return <KanbanBoardView tasks={tasks} />;
      case "matrix":
        return <PriorityMatrixView tasks={tasks} />;
      case "focus":
        return <FocusModeView tasks={tasks} />;
      default:
        return <EnergyTimelineView peakWindow={peakWindow} tasks={tasks} />;
    }
  })();

  return (
    <div className="space-y-xl pb-[88px] lg:pb-0">
      <div className="flex flex-wrap items-end justify-between gap-lg">
        <div>
          <SectionTitle>{todayLabel}</SectionTitle>
          <BodyText>{getLayoutIntro(preferredLayout)}</BodyText>
        </div>
        <div className="flex flex-wrap gap-sm">
          <GhostButton
            onClick={() => setPreferredLayout("focus")}
            title="Focus mode"
          />
          <PrimaryButton onClick={() => setSheetOpen(true)} title="+ Add task" />
        </div>
      </div>

      <LayoutSwitcher />

      <CanvasDueSoon />

      <div className="grid gap-lg xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-lg">
          {!interleavingDismissed && interleaving ? (
            <InterleavingSuggestionCard
              courseName={interleaving.courseName}
              minutes={interleaving.minutes}
              onAccept={() => {
                const alternateCourse =
                  tasks.find(
                    (task) =>
                      task.courseName &&
                      task.courseName !== interleaving.courseName &&
                      task.status !== "completed",
                  )?.courseName ?? "General Review";
                const suggestion = findScheduleSuggestions({
                  tasks,
                  category: "study_review",
                  durationMinutes: 30,
                  peakWindow,
                  energyLevel: "medium",
                })[0];

                createTaskFromInput({
                  title: `${alternateCourse} interleave review`,
                  category: "study_review",
                  courseName: alternateCourse,
                  durationMinutes: 30,
                  priority: "important",
                  labels: ["@review-later"],
                  scheduledTime: suggestion?.start ?? "15:00",
                  endTime: suggestion?.end ?? "15:30",
                  implementationIntention: `When I finish ${interleaving.courseName}, I will switch to ${alternateCourse} for a 30-minute review block.`,
                });
                setInterleavingDismissed(true);
              }}
              onDismiss={() => setInterleavingDismissed(true)}
            />
          ) : null}

          {layoutContent}
        </div>

        <div className="space-y-lg">
          <Card>
            <SectionTitle>Today at a glance</SectionTitle>
            <div className="grid gap-md sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-lg border border-border/60 bg-background-tertiary/70 p-md">
                <p className="font-mono text-lg text-accent-primary">{stats.taskCount}</p>
                <BodyText>active tasks</BodyText>
              </div>
              <div className="rounded-lg border border-border/60 bg-background-tertiary/70 p-md">
                <p className="font-mono text-lg text-accent-primary">{stats.focusHours}h</p>
                <BodyText>deep work load</BodyText>
              </div>
              <div className="rounded-lg border border-border/60 bg-background-tertiary/70 p-md">
                <p className="font-mono text-lg text-accent-primary">{quickWinTasks.length}</p>
                <BodyText>quick wins ready</BodyText>
              </div>
            </div>
          </Card>

          {quickWinTasks.length ? (
            <Card className="border-accent-secondary/30 bg-accent-secondary/8">
              <SectionTitle>Quick wins batch</SectionTitle>
              <BodyText className="mb-md">
                You have {quickWinTasks.length} tasks under low friction. Batch them in one trough window to reduce context switching.
              </BodyText>
              <div className="space-y-sm">
                {quickWinTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-md border border-border/60 bg-background-secondary/70 px-md py-sm"
                  >
                    <span className="text-sm text-text-primary">{task.title}</span>
                    <span className="font-mono text-xs text-text-tertiary">{task.durationMinutes}m</span>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          <BreakCard suggestion="Use a 10-minute movement break after your first 90-minute block. The goal is recovery quality, not just stepping away from the screen." />
        </div>
      </div>

      <AddTaskSheet onClose={() => setSheetOpen(false)} open={sheetOpen} />
    </div>
  );
}
