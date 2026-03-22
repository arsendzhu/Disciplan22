"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Card } from "@/components/ui/Card";
import { useCanvasData } from "@/hooks/useCanvasData";
import { useNPCStore } from "@/store/npcStore";
import { useScheduleStore } from "@/store/scheduleStore";
import type { PulseTask } from "@/store/scheduleStore";

import {
  buildCourseColorMap,
  buildDayStates,
  buildDeadlineItemsByDay,
  buildPositionedTasks,
  buildTimelineGridColumns,
  buildTimelineMinWidth,
  displayedDaysForRange,
  getDateKey,
  getRangeTitle,
  minutesSinceStartOfDay,
  PIXELS_PER_MINUTE,
  shiftAnchorDate,
  startOfDay,
  summaryPreviewCountForRange,
  timelineColumnMinWidth,
  type CalendarRange,
} from "../_lib/calendar-helpers";

import { CalendarLegend } from "./CalendarLegend";
import { CalendarMonthView } from "./CalendarMonthView";
import { CalendarTimelineView } from "./CalendarTimelineView";
import { CalendarToolbar } from "./CalendarToolbar";

type TodayCalendarProps = {
  tasks: PulseTask[];
};

export function TodayCalendar({ tasks }: TodayCalendarProps) {
  const { assignments, courses } = useCanvasData();
  const completeTask = useScheduleStore((state) => state.completeTask);
  const skipTask = useScheduleStore((state) => state.skipTask);
  const startTask = useScheduleStore((state) => state.startTask);
  const celebrateTaskCompletion = useNPCStore((state) => state.celebrateTaskCompletion);

  const [range, setRange] = useState<CalendarRange>("day");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [, setNowTick] = useState(0);

  const today = startOfDay(new Date());
  const [anchorDate, setAnchorDate] = useState(() => startOfDay(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setNowTick((n) => n + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const now = new Date();
  const currentLineY = minutesSinceStartOfDay(now) * PIXELS_PER_MINUTE;
  const todayKey = getDateKey(today);

  const sortedTasks = useMemo(
    () => [...tasks].sort((left, right) => left.scheduledTime.localeCompare(right.scheduledTime)),
    [tasks],
  );
  const positionedTasks = useMemo(() => buildPositionedTasks(sortedTasks), [sortedTasks]);

  const courseColorMap = useMemo(() => buildCourseColorMap(courses), [courses]);

  const deadlineItemsByDay = useMemo(
    () => buildDeadlineItemsByDay(sortedTasks, assignments, courseColorMap),
    [assignments, courseColorMap, sortedTasks],
  );

  const displayedDays = useMemo(
    () => displayedDaysForRange(range, anchorDate),
    [anchorDate, range],
  );

  const currentRangeTitle = useMemo(
    () => getRangeTitle(range, anchorDate, displayedDays),
    [anchorDate, displayedDays, range],
  );

  const timelineDays = range === "month" ? [] : displayedDays;
  const dayColumnMinWidth = timelineColumnMinWidth(range);
  const gridTemplateColumns = buildTimelineGridColumns(timelineDays.length);
  const timelineMinWidth = buildTimelineMinWidth(timelineDays.length, dayColumnMinWidth);
  const summaryPreviewCount = summaryPreviewCountForRange(range);

  const dayStates = useMemo(
    () =>
      buildDayStates(displayedDays, deadlineItemsByDay, positionedTasks.length, todayKey),
    [deadlineItemsByDay, displayedDays, positionedTasks.length, todayKey],
  );

  useEffect(() => {
    if (range === "month" || !scrollContainerRef.current) return;
    scrollContainerRef.current.scrollTop = Math.max(currentLineY - 240, 0);
  }, [anchorDate, currentLineY, range]);

  const handleComplete = (id: string) => {
    completeTask(id);
    celebrateTaskCompletion();
  };

  return (
    <Card className="space-y-0 overflow-hidden p-0">
      <div className="space-y-lg p-lg pb-0">
        <CalendarToolbar
          title={currentRangeTitle}
          range={range}
          onNext={() => setAnchorDate((d) => shiftAnchorDate(d, range, 1))}
          onPrev={() => setAnchorDate((d) => shiftAnchorDate(d, range, -1))}
          onRangeChange={setRange}
          onToday={() => setAnchorDate(startOfDay(new Date()))}
        />
      </div>

      <div className="px-lg pb-lg">
        {range === "month" ? (
          <CalendarMonthView
            anchorDate={anchorDate}
            dayStates={dayStates}
            deadlineItemsByDay={deadlineItemsByDay}
            displayedDays={displayedDays}
            onSelectDay={(day) => {
              setAnchorDate(day);
              setRange("day");
            }}
            positionedTasks={positionedTasks}
            today={today}
          />
        ) : (
          <CalendarTimelineView
            currentLineY={currentLineY}
            dayStates={dayStates}
            deadlineItemsByDay={deadlineItemsByDay}
            gridTemplateColumns={gridTemplateColumns}
            positionedTasks={positionedTasks}
            range={range}
            scrollContainerRef={scrollContainerRef}
            summaryPreviewCount={summaryPreviewCount}
            timelineDays={timelineDays}
            timelineMinWidth={timelineMinWidth}
            today={today}
            todayKey={todayKey}
            onCompleteTask={handleComplete}
            onSkipTask={skipTask}
            onStartTask={startTask}
          />
        )}

        <CalendarLegend />
      </div>
    </Card>
  );
}
