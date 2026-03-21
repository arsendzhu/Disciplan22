import { NextResponse } from "next/server";

import { canvasAuthMissingMessage, getCourses, resolveCanvasAuthHeaders } from "@/lib/canvas";

export async function GET(request: Request) {
  const headers = resolveCanvasAuthHeaders(request);
  if (!headers) {
    return NextResponse.json({ error: canvasAuthMissingMessage() }, { status: 401 });
  }

  const courses = await getCourses(headers);
  return NextResponse.json(courses);
}
