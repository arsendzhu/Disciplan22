import { Card } from "../ui/Card";
import { BodyText } from "../ui/BodyText";

const swatches = [
  "bg-background-secondary",
  "bg-accent-primary/30",
  "bg-accent-primary/60",
  "bg-accent-tertiary/80",
  "bg-accent-tertiary",
];

export function WorkloadHeatmap() {
  return (
    <Card>
      <BodyText className="mb-md text-text-primary">Semester heatmap</BodyText>
      <div className="flex gap-xs overflow-x-auto pb-sm">
        {Array.from({ length: 56 }).map((_, index) => (
          <div
            key={index}
            className={`h-14 min-w-[18px] rounded-sm border border-border/40 ${swatches[index % swatches.length]}`}
          />
        ))}
      </div>
    </Card>
  );
}
