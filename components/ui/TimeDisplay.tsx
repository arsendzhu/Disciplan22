import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function TimeDisplay({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "font-mono text-sm tracking-[0.16em] text-accent-primary uppercase",
        className,
      )}
      {...props}
    />
  );
}
