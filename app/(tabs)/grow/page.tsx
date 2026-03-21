"use client";

import { useRouter } from "next/navigation";

import { MilestoneCard } from "@/components/grow/MilestoneCard";
import { StreakDisplay } from "@/components/grow/StreakDisplay";
import { TreeCanvas } from "@/components/grow/TreeCanvas";
import { BodyText } from "@/components/ui/BodyText";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useGrowth } from "@/hooks/useGrowth";
import { useScheduleStore } from "@/store/scheduleStore";

export default function GrowPage() {
  const router = useRouter();
  const growth = useGrowth();
  const setPreferredLayout = useScheduleStore((state) => state.setPreferredLayout);

  return (
    <div className="space-y-xl pb-[88px] lg:pb-0">
      <div className="flex flex-wrap items-end justify-between gap-lg">
        <div>
          <SectionTitle>Your tree</SectionTitle>
          <BodyText>Level {growth.level}</BodyText>
        </div>
      </div>

      <Card className="flex justify-center">
        <div className="flex flex-col items-center">
          <TreeCanvas level={growth.level} variant={growth.treeVariant} />
          <BodyText className="text-center">
            Current grove style: <span className="text-text-primary">{growth.treeVariant}</span>
          </BodyText>
        </div>
      </Card>

      <div className="grid gap-lg lg:grid-cols-2">
        <Card>
          <BodyText className="mb-sm text-text-primary">Today&apos;s idle time: 1hr 24min</BodyText>
          <BodyText>70% of daily goal</BodyText>
        </Card>
        <Card>
          <StreakDisplay current={growth.currentStreak} longest={growth.longestStreak} />
        </Card>
      </div>

      <PrimaryButton
        onClick={() => {
          setPreferredLayout("focus");
          router.push("/today");
        }}
        title="Start focus session"
      />

      <div className="space-y-md">
        <MilestoneCard label="1hr idle → New tree species" unlocked />
        <MilestoneCard label="5hr idle → Forest background" />
        <MilestoneCard label="7-day streak → NPC new outfit" />
        <MilestoneCard label="Seasonal orchard fruits and birds can be switched from the sidebar theme controls." unlocked />
      </div>
    </div>
  );
}
