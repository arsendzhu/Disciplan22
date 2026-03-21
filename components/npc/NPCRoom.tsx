import { PropsWithChildren } from "react";

import { NPCState } from "@/lib/npcState";
import { cn } from "@/lib/utils";

const stateBg: Record<NPCState, string> = {
  thriving:
    "from-[rgba(26,45,31,0.95)] via-[rgba(30,37,28,0.94)] to-[rgba(15,14,12,0.98)]",
  happy:
    "from-[rgba(43,41,27,0.95)] via-[rgba(30,31,28,0.94)] to-[rgba(15,14,12,0.98)]",
  focused:
    "from-[rgba(24,31,41,0.95)] via-[rgba(26,25,22,0.94)] to-[rgba(15,14,12,0.98)]",
  neutral:
    "from-[rgba(35,33,25,0.95)] via-[rgba(26,25,22,0.96)] to-[rgba(15,14,12,0.98)]",
  tired:
    "from-[rgba(45,36,24,0.97)] via-[rgba(28,24,20,0.96)] to-[rgba(15,14,12,0.99)]",
  stressed:
    "from-[rgba(45,26,24,0.97)] via-[rgba(30,21,19,0.96)] to-[rgba(15,14,12,0.99)]",
  overwhelmed:
    "from-[rgba(36,18,17,0.99)] via-[rgba(24,15,14,0.98)] to-[rgba(10,9,8,1)]",
};

export function NPCRoom({ state, children }: PropsWithChildren<{ state: NPCState }>) {
  const clutter = state === "stressed" || state === "overwhelmed";
  const bright = state === "happy" || state === "thriving";
  const rainy = state === "overwhelmed";

  return (
    <div
      className={cn(
        "relative min-h-[430px] overflow-hidden rounded-xl border border-border bg-gradient-to-b p-xl shadow-[0_24px_80px_rgba(0,0,0,0.42)]",
        stateBg[state],
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(232,201,122,0.08),transparent_36%)]" />
      <div className="absolute right-8 top-8 h-36 w-28 rounded-[28px] border border-white/10 bg-gradient-to-b from-accent-primary/15 to-transparent shadow-[0_0_60px_rgba(232,201,122,0.10)]">
        {rainy ? <div className="absolute inset-0 bg-[repeating-linear-gradient(160deg,transparent,transparent_10px,rgba(242,237,228,0.08)_10px,rgba(242,237,228,0.08)_12px)]" /> : null}
      </div>
      <div className={cn("absolute left-8 top-10 h-28 w-12 rounded-full bg-accent-secondary/20", !bright && "bg-accent-secondary/10")} />
      <div className="absolute bottom-12 left-8 right-8 h-20 rounded-[24px] border border-white/6 bg-black/18" />
      {clutter ? (
        <>
          <div className="absolute left-16 top-48 h-10 w-14 rotate-[-11deg] rounded-md bg-accent-tertiary/18" />
          <div className="absolute right-20 top-52 h-10 w-16 rotate-[14deg] rounded-md bg-accent-tertiary/16" />
          <div className="absolute bottom-28 right-16 h-12 w-20 rotate-[-8deg] rounded-md bg-accent-primary/10" />
        </>
      ) : null}
      {bright ? (
        <>
          <div className="absolute left-24 top-10 text-accent-primary/75">✦ ✦ ✦</div>
          <div className="absolute right-24 top-36 text-accent-secondary/65">✦</div>
        </>
      ) : null}
      <div className="relative flex min-h-[360px] items-end justify-center">{children}</div>
    </div>
  );
}
