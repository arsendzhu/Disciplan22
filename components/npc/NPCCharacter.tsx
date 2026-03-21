"use client";

import { motion } from "framer-motion";

import { NPCState } from "@/lib/npcState";
import { cn } from "@/lib/utils";

type NPCCharacterProps = {
  state: NPCState;
  onClick?: () => void;
  className?: string;
};

const stateTone = {
  thriving: "from-accent-secondary/70 to-accent-primary/80",
  happy: "from-accent-primary/80 to-accent-quaternary/60",
  focused: "from-accent-quaternary/75 to-accent-primary/60",
  neutral: "from-accent-primary/70 to-background-tertiary",
  tired: "from-[#7a6443] to-[#2d2418]",
  stressed: "from-accent-tertiary/80 to-[#2d1a18]",
  overwhelmed: "from-accent-tertiary to-[#1b1110]",
} as const;

export function NPCCharacter({ state, onClick, className }: NPCCharacterProps) {
  const stressed = state === "stressed" || state === "overwhelmed";
  const tired = state === "tired";
  const happy = state === "happy" || state === "thriving";

  return (
    <motion.button
      animate={{
        y: tired ? [0, 4, 0] : [0, -8, 0],
        rotate: tired ? [-1, 1, -1] : 0,
        scale: [1, 1.015, 1],
      }}
      className={cn("relative h-[260px] w-[220px] border-none bg-transparent p-0", className)}
      onClick={onClick}
      transition={{ duration: tired ? 5 : 3.2, repeat: Infinity, ease: "easeInOut" }}
      type="button"
    >
      <div className="absolute inset-x-8 bottom-2 h-8 rounded-full bg-black/30 blur-xl" />
      <div
        className={cn(
          "absolute inset-x-10 top-4 h-[120px] rounded-[44px] bg-gradient-to-b shadow-[0_20px_50px_rgba(0,0,0,0.25)]",
          stateTone[state],
        )}
      />
      <div className="absolute left-1/2 top-[42px] h-[92px] w-[92px] -translate-x-1/2 rounded-full border border-white/10 bg-accent-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
        <span className="absolute left-[26px] top-[34px] h-2.5 w-2.5 rounded-full bg-background-primary" />
        <span className="absolute right-[26px] top-[34px] h-2.5 w-2.5 rounded-full bg-background-primary" />
        <span
          className={cn(
            "absolute left-1/2 top-[58px] h-[10px] w-[28px] -translate-x-1/2 rounded-full border-b-[3px] border-background-primary",
            happy && "rotate-180",
            stressed && "translate-y-1",
            tired && "w-[22px]",
          )}
        />
      </div>
      <div
        className={cn(
          "absolute left-1/2 top-[116px] h-[118px] w-[148px] -translate-x-1/2 rounded-[42px_42px_32px_32px] border border-white/6",
          stressed ? "bg-accent-tertiary/65" : "bg-accent-quaternary/58",
        )}
      />
      <div className="absolute left-[34px] top-[138px] h-[78px] w-[34px] rounded-full bg-accent-primary/45" />
      <div className="absolute right-[34px] top-[138px] h-[78px] w-[34px] rounded-full bg-accent-primary/45" />
      {tired ? (
        <div className="absolute right-2 top-[126px] rounded-full bg-background-secondary px-3 py-2 text-xs uppercase tracking-[0.18em] text-text-secondary">
          coffee
        </div>
      ) : null}
      {happy ? (
        <>
          <span className="absolute left-0 top-[42px] text-2xl text-accent-secondary">✦</span>
          <span className="absolute right-0 top-[22px] text-xl text-text-primary">✦</span>
        </>
      ) : null}
    </motion.button>
  );
}
