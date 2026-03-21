import { NextResponse } from "next/server";

import { getCourses } from "@/lib/canvas";

export async function GET(request: Request) {
  const token = request.headers.get("x-canvas-token");

  if (!token) {
    return NextResponse.json({ error: "Missing x-canvas-token header" }, { status: 400 });
  }

  const courses = await getCourses(token);
  return NextResponse.json(courses);
}
