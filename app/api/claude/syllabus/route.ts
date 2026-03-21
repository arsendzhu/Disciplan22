import { NextResponse } from "next/server";

import { parseSyllabus } from "@/lib/claude";

export async function POST(request: Request) {
  const body = (await request.json()) as { syllabusText?: string; courseName?: string };
  const result = await parseSyllabus(body.syllabusText ?? "", body.courseName ?? "Course");
  return NextResponse.json(result);
}
