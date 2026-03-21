import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function SectionTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "font-display text-[clamp(1.375rem,1.2rem+0.8vw,1.75rem)] leading-tight text-text-primary",
        className,
      )}
      {...props}
    />
  );
}
