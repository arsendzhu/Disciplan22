import { Card } from "../ui/Card";
import { BodyText } from "../ui/BodyText";

export function MilestoneCard({ label, unlocked = false }: { label: string; unlocked?: boolean }) {
  return (
    <Card className={unlocked ? "border-accent-secondary/60 bg-accent-secondary/8" : ""}>
      <BodyText className="text-text-primary">{label}</BodyText>
    </Card>
  );
}
