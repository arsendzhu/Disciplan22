import { BodyText } from "../ui/BodyText";

export function StreakDisplay({ current, longest }: { current: number; longest: number }) {
  return (
    <div className="space-y-xs">
      <BodyText className="font-bold text-text-primary">Current streak: {current} days</BodyText>
      <BodyText>Longest streak: {longest} days</BodyText>
    </div>
  );
}
