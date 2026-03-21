"use client";

import { motion } from "framer-motion";

import { buildCognitiveCurve } from "@/lib/schedule-logic";
import { PeakEnergyWindow } from "@/store/userStore";

import { Card } from "../ui/Card";
import { BodyText } from "../ui/BodyText";
import { SectionTitle } from "../ui/SectionTitle";

type CognitivePoint = {
  hour: number;
  predictedEnergy: number;
};

function peakLabelMap(peakWindow: PeakEnergyWindow) {
  if (peakWindow === "morning") {
    return {
      peak: "Peak: 8AM-11AM",
      secondary: "Secondary: 2PM-4PM",
    };
  }

  if (peakWindow === "evening") {
    return {
      peak: "Peak: 5PM-9PM",
      secondary: "Secondary: 9PM-11PM",
    };
  }

  return {
    peak: "Peak: 10AM-1PM",
    secondary: "Secondary: 4PM-6PM",
  };
}

function buildPath(curve: CognitivePoint[]) {
  return curve
    .map((point, index) => {
      const x = (point.hour / 23) * 100;
      const y = 34 - point.predictedEnergy * 26;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export function CognitiveLoadBar({
  curve = buildCognitiveCurve("afternoon"),
  peakWindow = "afternoon",
}: {
  curve?: CognitivePoint[];
  peakWindow?: PeakEnergyWindow;
}) {
  const labels = peakLabelMap(peakWindow);
  const linePath = buildPath(curve);
  const fillPath = `${linePath} L 100 40 L 0 40 Z`;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentX = Math.min(Math.max((currentMinutes / (24 * 60)) * 100, 0), 100);

  return (
    <Card className="overflow-hidden">
      <div className="mb-lg flex items-center justify-between gap-md">
        <SectionTitle className="mb-0">Cognitive load curve</SectionTitle>
        <BodyText>{labels.peak}</BodyText>
      </div>
      <div className="relative h-32 overflow-hidden rounded-lg border border-border/60 bg-background-tertiary/80">
        <div className="absolute inset-y-0 left-[33%] w-[18%] bg-accent-primary/7" />
        <div className="absolute inset-y-0 left-[58%] w-[16%] bg-accent-quaternary/7" />
        <svg className="absolute inset-0 h-full w-full" fill="none" viewBox="0 0 100 40">
          <defs>
            <linearGradient id="curveFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(232,201,122,0.52)" />
              <stop offset="100%" stopColor="rgba(232,201,122,0.02)" />
            </linearGradient>
          </defs>
          <motion.path
            animate={{ pathLength: 1, opacity: 1 }}
            d={fillPath}
            fill="url(#curveFill)"
            initial={{ pathLength: 0, opacity: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.path
            animate={{ pathLength: 1, opacity: 1 }}
            d={linePath}
            initial={{ pathLength: 0, opacity: 0.3 }}
            stroke="var(--accent-primary)"
            strokeWidth="2"
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
          <line
            stroke="rgba(242,237,228,0.32)"
            strokeDasharray="2 3"
            x1={currentX}
            x2={currentX}
            y1="0"
            y2="40"
          />
        </svg>
        <div className="absolute bottom-3 left-4 flex flex-wrap gap-md text-[0.65rem] uppercase tracking-[0.18em] text-text-tertiary">
          <span>predicted energy</span>
          <span>{labels.secondary}</span>
        </div>
      </div>
    </Card>
  );
}
