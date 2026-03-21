"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Sparkles, CalendarDays } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { useNPCState } from "@/hooks/useNPCState";
import { usePreferencesStore } from "@/store/preferencesStore";
import { ThemeControls } from "./ThemeControls";

const links = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/today", label: "Today", icon: CalendarDays },
  { href: "/canvas", label: "Canvas", icon: BookOpen },
] as const;

function NPCMiniFace({ stressed }: { stressed: boolean }) {
  return (
    <div
      className={cn(
        "relative h-9 w-9 rounded-full border border-border",
        stressed ? "bg-accent-tertiary/80" : "bg-accent-primary",
      )}
    >
      <span className="absolute left-[10px] top-[12px] h-1.5 w-1.5 rounded-full bg-background-primary" />
      <span className="absolute right-[10px] top-[12px] h-1.5 w-1.5 rounded-full bg-background-primary" />
      <span
        className={cn(
          "absolute left-1/2 top-[22px] h-1 w-3 -translate-x-1/2 rounded-full border-b-2 border-background-primary",
          stressed ? "" : "rotate-180",
        )}
      />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentState } = useNPCState();
  const mode = usePreferencesStore((state) => state.mode);
  const palette = usePreferencesStore((state) => state.palette);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.documentElement.dataset.palette = palette;
  }, [mode, palette]);

  return (
    <div className="mx-auto grid min-h-screen max-w-[1680px] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden border-r border-border/70 bg-background-secondary/65 px-xl py-xxl backdrop-blur-xl lg:flex lg:flex-col">
        <div className="mb-xxl">
          <div className="mb-md flex items-center gap-md">
            <NPCMiniFace stressed={currentState === "stressed" || currentState === "overwhelmed"} />
            <div>
              <p className="font-display text-3xl text-accent-primary">DisciPlan</p>
              <p className="text-sm uppercase tracking-[0.22em] text-text-tertiary">AI study companion</p>
            </div>
          </div>
          <p className="max-w-[18rem] text-sm leading-7 text-text-secondary">
            Soft dark academia for students who want their planner to feel alive.
          </p>
        </div>

        <nav className="space-y-sm">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                className={cn(
                  "flex items-center gap-md rounded-lg border px-lg py-md text-sm transition duration-200",
                  active
                    ? "border-accent-primary/50 bg-accent-primary/8 text-text-primary shadow-[0_0_0_1px_rgba(232,201,122,0.16)]"
                    : "border-transparent text-text-secondary hover:border-border hover:bg-background-tertiary/75",
                )}
                href={href}
              >
                <Icon className={cn("h-4 w-4", active ? "text-accent-primary" : "text-text-tertiary")} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-md">
          <ThemeControls />
          <div className="rounded-xl border border-border bg-background-tertiary/80 p-lg">
            <p className="mb-sm text-xs uppercase tracking-[0.22em] text-text-tertiary">Demo mode</p>
            <p className="text-sm leading-7 text-text-secondary">
            The preview is seeded with realistic CSUEB-style coursework so you can show the product before live API keys are connected.
            </p>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mx-auto w-full max-w-[1280px] px-lg py-lg sm:px-xl sm:py-xl lg:px-xxl lg:py-xxl">
          {children}
        </div>
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background-secondary/92 px-md py-sm backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-[640px] items-center justify-between">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} className="flex flex-col items-center gap-1 text-[0.68rem] uppercase tracking-[0.16em]">
                  {href === "/" ? (
                    <NPCMiniFace stressed={currentState === "stressed" || currentState === "overwhelmed"} />
                  ) : (
                    <Icon className={cn("h-5 w-5", active ? "text-accent-primary" : "text-text-tertiary")} />
                  )}
                  <span className={active ? "text-accent-primary" : "text-text-tertiary"}>{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
