import { NextResponse } from "next/server";

import { getNPCMessage } from "@/lib/claude";

export async function POST(request: Request) {
  const body = (await request.json()) as { npcState?: string; relevantData?: string };
  const message = await getNPCMessage(body.npcState ?? "neutral", body.relevantData ?? "");
  return NextResponse.json({ message });
}
