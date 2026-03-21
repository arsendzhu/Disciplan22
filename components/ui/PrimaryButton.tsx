import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
};

export function PrimaryButton({ title, className, ...props }: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-accent-primary px-xl py-md text-sm font-bold text-background-primary transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(232,201,122,0.18)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {title}
    </button>
  );
}
