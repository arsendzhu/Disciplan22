"use client";

import { MoonStar, Palette, SunMedium } from "lucide-react";

import { usePreferencesStore } from "@/store/preferencesStore";
import { cn } from "@/lib/utils";

const palettes = [
  { value: "academia", label: "Academia" },
  { value: "carmine", label: "Carmine" },
  { value: "coastal", label: "Coastal" },
  { value: "forest", label: "Forest" },
] as const;

export function ThemeControls() {
  const mode = usePreferencesStore((state) => state.mode);
  const palette = usePreferencesStore((state) => state.palette);
  const setMode = usePreferencesStore((state) => state.setMode);
  const setPalette = usePreferencesStore((state) => state.setPalette);

  return (
    <div className="space-y-md rounded-xl border border-border bg-background-tertiary/75 p-lg">
      <div className="flex items-center gap-sm text-xs uppercase tracking-[0.22em] text-text-tertiary">
        <Palette className="h-3.5 w-3.5" />
        Theme
      </div>
      <div className="flex gap-sm">
        {[
          { value: "dark", label: "Dark", icon: MoonStar },
          { value: "light", label: "Light", icon: SunMedium },
        ].map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            className={cn(
              "flex flex-1 items-center justify-center gap-sm rounded-md border px-md py-sm text-sm transition",
              mode === value
                ? "border-accent-primary bg-accent-primary/10 text-text-primary"
                : "border-border text-text-secondary hover:border-accent-primary/35",
            )}
            onClick={() => setMode(value as "dark" | "light")}
            type="button"
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <label className="block space-y-sm">
        <span className="text-xs uppercase tracking-[0.22em] text-text-tertiary">Palette</span>
        <select
          className="w-full rounded-md border border-border bg-background-secondary px-md py-sm text-sm text-text-primary outline-none focus:border-accent-primary"
          onChange={(event) => setPalette(event.target.value as typeof palette)}
          value={palette}
        >
          {palettes.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
