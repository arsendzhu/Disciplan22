"use client";

import Link from "next/link";

import { BodyText } from "@/components/ui/BodyText";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PeakEnergyWindow, useUserStore } from "@/store/userStore";
import { cn } from "@/lib/utils";

const options: Array<{ emoji: string; label: string; value: PeakEnergyWindow }> = [
  { emoji: "🌅", label: "Morning person", value: "morning" },
  { emoji: "☀️", label: "Afternoon", value: "afternoon" },
  { emoji: "🌙", label: "Night owl", value: "evening" },
];

export default function SetupProfilePage() {
  const profile = useUserStore((state) => state.profile);
  const updateProfile = useUserStore((state) => state.updateProfile);

  return (
    <Card className="w-full p-xxl">
      <div className="mb-xl">
        <SectionTitle>When do you work best?</SectionTitle>
        <BodyText>
          We&apos;ll build DisciPlan around your actual rhythm instead of forcing your day into a generic planner.
        </BodyText>
      </div>

      <div className="mb-xl space-y-md">
        {options.map((option) => (
          <button
            key={option.value}
            className={cn(
              "flex w-full items-center gap-md rounded-lg border border-border bg-background-secondary px-lg py-lg text-left transition hover:border-accent-primary/35",
              profile.peakEnergyWindow === option.value &&
                "border-accent-primary bg-accent-primary/8",
            )}
            onClick={() => updateProfile({ peakEnergyWindow: option.value })}
            type="button"
          >
            <span className="text-2xl">{option.emoji}</span>
            <span className="text-text-primary">{option.label}</span>
          </button>
        ))}
      </div>

      <div className="mb-xl grid gap-lg sm:grid-cols-2">
        <label className="space-y-sm">
          <BodyText>Usual bedtime</BodyText>
          <input
            className="w-full rounded-lg border border-border bg-background-tertiary px-lg py-md text-text-primary outline-none focus:border-accent-primary"
            onChange={(event) => updateProfile({ sleepBedtime: event.target.value })}
            type="time"
            value={profile.sleepBedtime}
          />
        </label>
        <label className="space-y-sm">
          <BodyText>Wake time</BodyText>
          <input
            className="w-full rounded-lg border border-border bg-background-tertiary px-lg py-md text-text-primary outline-none focus:border-accent-primary"
            onChange={(event) => updateProfile({ wakeTime: event.target.value })}
            type="time"
            value={profile.wakeTime}
          />
        </label>
      </div>

      <Link
        className="inline-flex items-center justify-center rounded-lg bg-accent-primary px-xl py-md text-sm font-bold text-background-primary transition duration-200 hover:-translate-y-0.5"
        href="/"
      >
        Build my schedule
      </Link>
    </Card>
  );
}
