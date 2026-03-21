import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background-secondary/95 p-lg shadow-[0_18px_60px_rgba(0,0,0,0.34),0_8px_24px_rgba(0,0,0,0.22)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
