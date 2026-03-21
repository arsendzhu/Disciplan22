import { Assignment } from "@/store/canvasStore";
import { formatDateLabel } from "@/lib/utils";

import { Chip } from "../ui/Chip";
import { BodyText } from "../ui/BodyText";

export function AssignmentItem({ assignment }: { assignment: Assignment }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-md rounded-lg border border-border/60 bg-background-tertiary/70 px-lg py-md">
      <div>
        <h4 className="font-body text-sm font-bold text-text-primary">{assignment.title}</h4>
        <BodyText>{formatDateLabel(assignment.dueDate)}</BodyText>
      </div>
      <Chip label={assignment.source === "syllabus" ? "Found outside Canvas" : "Canvas"} />
    </div>
  );
}
