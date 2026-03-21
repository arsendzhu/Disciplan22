import { Card } from "../ui/Card";
import { BodyText } from "../ui/BodyText";

export function QuoteCard({ quote, author }: { quote: string; author: string }) {
  return (
    <Card>
      <BodyText className="text-text-primary">&quot;{quote}&quot;</BodyText>
      <BodyText className="mt-sm">{author}</BodyText>
    </Card>
  );
}
