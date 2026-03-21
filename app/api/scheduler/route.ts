import { NextResponse } from "next/server";

import { generateDailySchedule } from "@/lib/scheduler";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await generateDailySchedule(body);
  return NextResponse.json(result);
}
