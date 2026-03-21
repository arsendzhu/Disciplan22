import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  label: string;
};

export function Chip({ label, className, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-border bg-background-tertiary px-md py-sm text-[0.72rem] font-medium uppercase tracking-[0.18em] text-text-secondary",
        className,
      )}
      {...props}
    >
      {label}
    </span>
  );
}
