import { NextResponse } from "next/server";

import { getAssignments } from "@/lib/canvas";

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

  const assignments = await getAssignments(token, courseId);
  return NextResponse.json(assignments);
}
