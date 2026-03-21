import { ReactNode } from "react";

import { calculateNPCState, NPCUserData } from "@/lib/npcState";

export function NPCStateEngine({
  userData,
  children,
  render,
}: {
  userData: NPCUserData;
  children?: ReactNode;
  render?: (state: ReturnType<typeof calculateNPCState>) => ReactNode;
}) {
  const state = calculateNPCState(userData);
  return <>{render ? render(state) : children}</>;
}
