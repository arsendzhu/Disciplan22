import { Card } from "../ui/Card";
import { BodyText } from "../ui/BodyText";

export function ActivityCard({ label }: { label: string }) {
  return (
    <Card className="py-md">
      <BodyText>{label}</BodyText>
    </Card>
  );
}
