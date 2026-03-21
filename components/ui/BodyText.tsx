import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function BodyText({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("font-body text-[0.95rem] leading-[1.7] text-text-secondary", className)}
      {...props}
    />
  );
}
