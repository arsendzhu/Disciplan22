"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { NPCCharacter } from "@/components/npc/NPCCharacter";
import { BodyText } from "@/components/ui/BodyText";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useUserStore } from "@/store/userStore";

export default function WelcomePage() {
  const signInWithEmail = useUserStore((state) => state.signInWithEmail);

  return (
    <Card className="w-full bg-[linear-gradient(180deg,rgba(26,25,22,0.96),rgba(15,14,12,0.98))] p-xxl">
      <div className="flex flex-col items-center gap-lg text-center">
        <motion.h1
          animate={{ opacity: [0.88, 1, 0.88], scale: [1, 1.02, 1] }}
          className="font-display text-[clamp(3rem,2rem+4vw,4.8rem)] text-accent-primary"
          transition={{ duration: 3, repeat: Infinity }}
        >
          Pulse
        </motion.h1>
        <BodyText className="max-w-[30rem] text-[1rem]">
          Your AI study companion that actually gets you.
        </BodyText>
        <NPCCharacter state="happy" />
        <div className="flex flex-wrap justify-center gap-md">
          <PrimaryButton
            onClick={() => signInWithEmail("alex@pulse.demo", "demo")}
            title="Enter demo"
          />
          <Link
            className="inline-flex items-center justify-center rounded-lg bg-accent-secondary px-xl py-md text-sm font-bold text-background-primary transition duration-200 hover:-translate-y-0.5"
            href="/"
          >
            Open dashboard
          </Link>
        </div>
        <BodyText className="text-text-tertiary">
          The web preview uses seeded demo data until live keys are added.
        </BodyText>
      </div>
    </Card>
  );
}
