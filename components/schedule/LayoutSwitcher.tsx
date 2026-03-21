"use client";

import { layoutMeta, ScheduleLayout } from "@/constants/schedule";
import { useScheduleStore } from "@/store/scheduleStore";
import { cn } from "@/lib/utils";

export function LayoutSwitcher() {
  const preferredLayout = useScheduleStore((state) => state.preferredLayout);
  const setPreferredLayout = useScheduleStore((state) => state.setPreferredLayout);

  return (
    <div className="flex flex-wrap items-center gap-sm rounded-full border border-border bg-background-secondary/70 p-1.5">
      {(Object.keys(layoutMeta) as ScheduleLayout[]).map((layout) => {
        const item = layoutMeta[layout];
        const Icon = item.icon;
        const active = preferredLayout === layout;

        return (
          <button
            key={layout}
            className={cn(
              "relative inline-flex items-center gap-sm rounded-full px-md py-sm text-xs uppercase tracking-[0.18em] transition",
              active
                ? "bg-accent-primary/12 text-accent-primary"
                : "text-text-tertiary hover:text-text-primary",
            )}
            onClick={() => setPreferredLayout(layout)}
            type="button"
          >
            <Icon className={cn("h-4 w-4", active ? "fill-accent-primary/10" : "")} />
            <span className={active ? "inline" : "hidden sm:inline"}>{item.shortLabel}</span>
            {active ? <span className="absolute inset-x-3 -bottom-1 h-[2px] rounded-full bg-accent-primary" /> : null}
          </button>
        );
      })}
    </div>
  );
}
