import { Course } from "@/store/canvasStore";

import { Card } from "../ui/Card";
import { BodyText } from "../ui/BodyText";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex items-center justify-between gap-lg">
      <div className="flex items-center gap-md">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: course.color }} />
        <div>
          <h3 className="font-body text-base font-bold text-text-primary">{course.name}</h3>
          <BodyText>{course.professorName}</BodyText>
        </div>
      </div>
      <BodyText>{course.dueThisWeek ? `${course.dueThisWeek} due this week` : "All caught up"}</BodyText>
    </Card>
  );
}
