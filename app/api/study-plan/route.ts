import { NextResponse } from "next/server";

import { fetchStudyPlanForAssignment } from "@/lib/perplexity";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const obj = typeof body === "object" && body ? (body as Record<string, unknown>) : {};
  const title = typeof obj.title === "string" ? obj.title.trim() : "";
  const dueDate = typeof obj.dueDate === "string" ? obj.dueDate.trim() : "";
  const courseName = typeof obj.courseName === "string" ? obj.courseName.trim() : undefined;

  if (!title || !dueDate) {
    return NextResponse.json({ error: "title and dueDate are required" }, { status: 400 });
  }

  const result = await fetchStudyPlanForAssignment({ title, dueDate, courseName });
  return NextResponse.json(result);
}
