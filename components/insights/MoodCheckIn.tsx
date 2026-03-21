"use client";

import { useState } from "react";

import { useUserStore } from "@/store/userStore";
import { cn } from "@/lib/utils";

import { Card } from "../ui/Card";
import { BodyText } from "../ui/BodyText";
import { PrimaryButton } from "../ui/PrimaryButton";

const moods = ["😴", "😔", "😐", "🙂", "😄"];

export function MoodCheckIn() {
  const submitCheckin = useUserStore((state) => state.submitCheckin);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);

  return (
    <Card>
      <BodyText className="mb-md font-bold text-text-primary">Mood check-in</BodyText>
      <div className="mb-lg flex gap-sm">
        {moods.map((emoji, index) => (
          <button
            key={emoji}
            className={cn(
              "flex-1 rounded-md border border-border bg-background-tertiary px-md py-sm text-2xl transition",
              mood === index + 1 && "scale-105 border-accent-primary bg-accent-primary/10",
            )}
            onClick={() => setMood(index + 1)}
            type="button"
          >
            {emoji}
          </button>
        ))}
      </div>
      <BodyText className="mb-sm">Energy</BodyText>
      <div className="mb-lg flex gap-sm">
        {Array.from({ length: 5 }).map((_, index) => (
          <button
            key={index}
            aria-label={`Energy ${index + 1}`}
            className={cn(
              "h-3 flex-1 rounded-full bg-background-tertiary transition",
              energy >= index + 1 && "bg-accent-primary",
            )}
            onClick={() => setEnergy(index + 1)}
            type="button"
          />
        ))}
      </div>
      <PrimaryButton
        onClick={() => submitCheckin(mood, energy)}
        title="Save check-in"
      />
    </Card>
  );
}
