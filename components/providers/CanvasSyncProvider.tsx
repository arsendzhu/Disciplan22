"use client";

import { createContext, useContext } from "react";

import { useCanvasSync } from "@/hooks/useCanvasSync";

type CanvasSyncContextValue = {
  sync: () => Promise<void>;
  hydrated: boolean;
};

const CanvasSyncContext = createContext<CanvasSyncContextValue | null>(null);

/** Runs Canvas sync once for the whole tab shell (Today + Canvas share the same store). */
export function CanvasSyncProvider({ children }: { children: React.ReactNode }) {
  const { sync, hydrated } = useCanvasSync();
  return (
    <CanvasSyncContext.Provider value={{ sync, hydrated }}>{children}</CanvasSyncContext.Provider>
  );
}

export function useCanvasSyncContext(): CanvasSyncContextValue {
  const ctx = useContext(CanvasSyncContext);
  if (!ctx) {
    throw new Error("useCanvasSyncContext must be used within CanvasSyncProvider");
  }
  return ctx;
}
