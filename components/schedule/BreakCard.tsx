import { Card } from "../ui/Card";
import { BodyText } from "../ui/BodyText";

export function BreakCard({ suggestion }: { suggestion: string }) {
  return (
    <Card className="border-l-4 border-l-accent-quaternary">
      <BodyText className="mb-sm font-serif italic text-text-primary">Break suggestion</BodyText>
      <BodyText>{suggestion}</BodyText>
    </Card>
  );
}
