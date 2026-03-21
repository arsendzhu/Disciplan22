import { NextResponse } from "next/server";

import { canvasAuthMissingMessage, getSyllabus, resolveCanvasAuthHeaders } from "@/lib/canvas";

export async function GET(request: Request) {
  const headers = resolveCanvasAuthHeaders(request);
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  if (!headers) {
    return NextResponse.json({ error: canvasAuthMissingMessage() }, { status: 401 });
  }

  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId query param" }, { status: 400 });
  }

  const syllabus = await getSyllabus(headers, courseId);
  return NextResponse.json({ syllabus });
}
