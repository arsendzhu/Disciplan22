import { NextResponse } from "next/server";

import {
  canvasAuthMissingMessage,
  getAssignments,
  getCoursesResult,
  resolveCanvasAuthHeaders,
} from "@/lib/canvas";
import { mapCanvasSyncToStore } from "@/lib/canvas-map";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const headers = resolveCanvasAuthHeaders(request);
  if (!headers) {
    return NextResponse.json({ error: canvasAuthMissingMessage() }, { status: 401 });
  }

  const courseResult = await getCoursesResult(headers);
  if (!courseResult.ok) {
    const status = courseResult.status === 401 ? 401 : 502;
    return NextResponse.json(
      { error: "Could not load Canvas courses. Reconnect Canvas if your session expired." },
      { status },
    );
  }

  const rawCourses = courseResult.courses;
  if (!rawCourses.length) {
    return NextResponse.json({ courses: [], assignments: [] });
  }

  const assignmentsByCourse = new Map<string, Awaited<ReturnType<typeof getAssignments>>>();

  await Promise.all(
    rawCourses.map(async (course) => {
      try {
        const list = await getAssignments(headers, course.id);
        assignmentsByCourse.set(course.id, list);
      } catch {
        assignmentsByCourse.set(course.id, []);
      }
    }),
  );

  const { courses, assignments } = mapCanvasSyncToStore(rawCourses, assignmentsByCourse);
  return NextResponse.json({ courses, assignments });
}
