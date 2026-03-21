"use client";

import { ActivityCard } from "@/components/discover/ActivityCard";
import { EventCard } from "@/components/discover/EventCard";
import { BodyText } from "@/components/ui/BodyText";
import { GhostButton } from "@/components/ui/GhostButton";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function DiscoverPage() {
  return (
    <div className="space-y-xl pb-[88px] lg:pb-0">
      <div className="flex flex-wrap items-end justify-between gap-lg">
        <div>
          <SectionTitle>Time to recharge</SectionTitle>
          <BodyText>Break suggestions that feel like a life, not a punishment.</BodyText>
        </div>
        <GhostButton title="Refresh" />
      </div>

      <EventCard title="Tonight&apos;s pick" details="Live Music at The Bistro · Tonight 8PM · 0.8 miles · Free" />

      <div className="space-y-md">
        <BodyText>Right now (quick breaks)</BodyText>
        <div className="grid gap-md md:grid-cols-2">
          <ActivityCard label="5 min: Box breathing" />
          <ActivityCard label="10 min: Walk" />
        </div>
      </div>

      <div className="space-y-md">
        <BodyText>This weekend</BodyText>
        <div className="grid gap-md md:grid-cols-2">
          <ActivityCard label="Farmers Market Sat" />
          <ActivityCard label="Campus Event Sun" />
          <ActivityCard label="Study Social Fri" />
          <ActivityCard label="Free Concert Sat" />
        </div>
      </div>
    </div>
  );
}
