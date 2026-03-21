"use client";

import { useMemo } from "react";

import { useCanvasData } from "@/hooks/useCanvasData";

import { BodyText } from "../ui/BodyText";
import { Card } from "../ui/Card";
import { SectionTitle } from "../ui/SectionTitle";

import { CanvasAssignmentRow } from "./CanvasAssignmentRow";

/** Upcoming Canvas assignments on Today (uses shared Canvas store + sync). */
export function CanvasDueSoon() {
  const { assignments, courses, syncStatus } = useCanvasData();

  const rows = useMemo(() => {
    const now = Date.now();
    return [...assignments]
      .filter((a) => new Date(a.dueDate).getTime() >= now)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [assignments]);

  const nameFor = (courseId: string) => courses.find((c) => c.id === courseId)?.name ?? "Course";

  if (syncStatus === "loading" && rows.length === 0) {
    return (
      <Card>
        <SectionTitle>Canvas due soon</SectionTitle>
        <BodyText className="mt-sm text-sm text-text-secondary">Syncing assignments…</BodyText>
      </Card>
    );
  }

  if (rows.length === 0) {
    return null;
  }

  return (
    <Card>
      <SectionTitle>Canvas due soon</SectionTitle>
      <BodyText className="mb-md text-sm text-text-secondary">Next deadlines from your last sync.</BodyText>
      <div className="space-y-sm">
        {rows.map((a) => (
          <CanvasAssignmentRow key={a.id} assignment={a} courseName={nameFor(a.courseId)} compact />
        ))}
      </div>
    </Card>
  );
}
