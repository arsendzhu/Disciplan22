"use client";

import { AssignmentItem } from "@/components/canvas/AssignmentItem";
import { CourseCard } from "@/components/canvas/CourseCard";
import { SyllabusParser } from "@/components/canvas/SyllabusParser";
import { WorkloadHeatmap } from "@/components/canvas/WorkloadHeatmap";
import { BodyText } from "@/components/ui/BodyText";
import { Card } from "@/components/ui/Card";
import { GhostButton } from "@/components/ui/GhostButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useCanvasData } from "@/hooks/useCanvasData";

export default function CanvasPage() {
  const { assignments, courses, dangerWeek } = useCanvasData();

  return (
    <div className="space-y-xl pb-[88px] lg:pb-0">
      <div className="flex flex-wrap items-end justify-between gap-lg">
        <div>
          <SectionTitle>Your classes</SectionTitle>
          <BodyText>Canvas sync, syllabus parsing, and workload forecasting all in one place.</BodyText>
        </div>
        <GhostButton title="Sync ↻" />
      </div>

      <WorkloadHeatmap />
      <Card>
        <BodyText className="mb-sm text-accent-primary">Danger Week: {dangerWeek.label}</BodyText>
        <BodyText>{dangerWeek.summary}</BodyText>
      </Card>
      <SyllabusParser courses={courses.map((course) => course.name)} />

      <div className="space-y-md">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <Card>
        <SectionTitle>Upcoming assignments</SectionTitle>
        <div className="mt-lg space-y-md">
          {assignments.map((assignment) => (
            <AssignmentItem key={assignment.id} assignment={assignment} />
          ))}
        </div>
      </Card>
    </div>
  );
}
