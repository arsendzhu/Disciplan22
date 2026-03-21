import { NextResponse } from "next/server";

import { parseSiriInput } from "@/lib/claude";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    voiceInput?: string;
    userCourses?: Array<{ id: string; name: string }>;
  };

  const result = await parseSiriInput(body.voiceInput ?? "", body.userCourses ?? []);
  return NextResponse.json(result);
}
