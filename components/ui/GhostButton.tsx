import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type GhostButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
};

export function GhostButton({ title, className, ...props }: GhostButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg border border-accent-primary/65 bg-transparent px-xl py-md text-sm font-bold text-accent-primary transition duration-200 hover:border-accent-primary hover:bg-accent-primary/8",
        className,
      )}
      {...props}
    >
      {title}
    </button>
  );
}
