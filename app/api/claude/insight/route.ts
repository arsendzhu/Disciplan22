import { NextResponse } from "next/server";

import { generateDailyInsight } from "@/lib/claude";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    behaviorSummary?: string;
    patterns?: string;
    todayContext?: string;
  };

  const result = await generateDailyInsight({
    behaviorSummary: body.behaviorSummary ?? "",
    patterns: body.patterns ?? "",
    todayContext: body.todayContext ?? "",
  });

  return NextResponse.json(result);
}
