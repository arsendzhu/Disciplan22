import { NextResponse } from "next/server";

import { getSyllabus } from "@/lib/canvas";

export async function GET(request: Request) {
  const token = request.headers.get("x-canvas-token");
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  if (!token || !courseId) {
    return NextResponse.json(
      { error: "Missing x-canvas-token header or courseId query param" },
      { status: 400 },
    );
  }

  const syllabus = await getSyllabus(token, courseId);
  return NextResponse.json({ syllabus });
}
