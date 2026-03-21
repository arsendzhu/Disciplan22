import { Card } from "../ui/Card";
import { BodyText } from "../ui/BodyText";
import { SectionTitle } from "../ui/SectionTitle";

export function EventCard({ title, details }: { title: string; details: string }) {
  return (
    <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(35,33,25,0.98),rgba(26,25,22,0.94),rgba(139,167,212,0.08))]">
      <div className="mb-lg h-44 rounded-lg border border-border/60 bg-[radial-gradient(circle_at_top,rgba(232,201,122,0.18),transparent_45%),linear-gradient(145deg,rgba(35,33,25,0.95),rgba(15,14,12,0.98))]" />
      <SectionTitle>{title}</SectionTitle>
      <BodyText className="text-text-primary">{details}</BodyText>
    </Card>
  );
}
