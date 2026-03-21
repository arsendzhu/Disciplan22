"use client";

import { motion } from "framer-motion";

import { Card } from "../ui/Card";
import { BodyText } from "../ui/BodyText";
import { SectionTitle } from "../ui/SectionTitle";

export function DailyInsightCard({ insight }: { insight: string }) {
  return (
    <motion.div initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }} transition={{ duration: 0.45 }}>
      <Card className="bg-[linear-gradient(135deg,rgba(35,33,25,0.98),rgba(26,25,22,0.98),rgba(232,201,122,0.06))]">
        <SectionTitle>Today&apos;s insight</SectionTitle>
        <BodyText className="text-text-primary">{insight}</BodyText>
      </Card>
    </motion.div>
  );
}
