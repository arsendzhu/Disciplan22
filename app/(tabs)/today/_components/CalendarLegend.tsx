"use client";

import { CircleDot } from "lucide-react";

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-sm border-t border-border/50 pt-md text-[0.7rem] uppercase tracking-[0.14em] text-text-tertiary">
      <span className="inline-flex items-center gap-2 rounded-full border border-border px-md py-sm">
        <CircleDot className="h-3.5 w-3.5 text-accent-quaternary" aria-hidden />
        Day with work
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-border px-md py-sm">
        <CircleDot className="h-3.5 w-3.5 text-[#D4537E]" aria-hidden />
        Midterm or final
      </span>
    </div>
  );
}
