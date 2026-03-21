"use client";

import { Brain } from "lucide-react";

import { Card } from "../ui/Card";
import { BodyText } from "../ui/BodyText";
import { GhostButton } from "../ui/GhostButton";
import { PrimaryButton } from "../ui/PrimaryButton";

export function InterleavingSuggestionCard({
  courseName,
  minutes,
  onAccept,
  onDismiss,
}: {
  courseName: string;
  minutes: number;
  onAccept?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <Card className="border-accent-primary/35 bg-accent-primary/8">
      <div className="mb-md flex items-center gap-sm">
        <Brain className="h-4 w-4 text-accent-primary" />
        <p className="text-sm font-semibold text-text-primary">Memory boost available</p>
      </div>
      <BodyText className="mb-md">
        You&apos;ve scheduled {Math.round((minutes / 60) * 10) / 10} hours of {courseName} consecutively. Switching subjects for 30 minutes in the middle improves retention, even though it feels harder.
      </BodyText>
      <div className="flex flex-wrap gap-sm">
        <PrimaryButton onClick={onAccept} title="Try interleaving" />
        <GhostButton onClick={onDismiss} title="Keep as is" />
      </div>
    </Card>
  );
}
