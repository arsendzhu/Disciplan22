export const CANVAS_DOMAIN = "csueastbay.instructure.com";
export const CANVAS_BASE = `https://${CANVAS_DOMAIN}/api/v1`;

export type CanvasCourse = {
  id: string;
  name: string;
  course_code?: string;
  professor_name?: string;
  syllabus_body?: string;
};

export type CanvasAssignment = {
  id: string;
  name: string;
  due_at?: string | null;
  points_possible?: number | null;
};

export function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function getCanvasAuthorizationUrl() {
  const clientId = process.env.CANVAS_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_CANVAS_REDIRECT_URI;

  if (!clientId || !redirectUri) return null;

  const url = new URL(`https://${CANVAS_DOMAIN}/login/oauth2/auth`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set(
    "scope",
    [
      "url:GET|/api/v1/courses",
      "url:GET|/api/v1/courses/:id/assignments",
      "url:GET|/api/v1/courses/:id/pages",
    ].join(" "),
  );

  return url.toString();
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "content-type": "application/json",
  };
}

export async function getCourses(token: string): Promise<CanvasCourse[]> {
  const response = await fetch(
    `${CANVAS_BASE}/courses?enrollment_state=active&include[]=syllabus_body`,
    { headers: authHeaders(token), cache: "no-store" },
  );

  if (!response.ok) return [];

  const json = (await response.json()) as Array<Record<string, unknown>>;
  return json.map((course) => ({
    id: String(course.id),
    name: String(course.name ?? "Untitled course"),
    course_code: typeof course.course_code === "string" ? course.course_code : undefined,
    syllabus_body: typeof course.syllabus_body === "string" ? course.syllabus_body : undefined,
  }));
}

export async function getAssignments(token: string, courseId: string): Promise<CanvasAssignment[]> {
  const response = await fetch(`${CANVAS_BASE}/courses/${courseId}/assignments?per_page=50`, {
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (!response.ok) return [];

  const json = (await response.json()) as Array<Record<string, unknown>>;
  return json.map((assignment) => ({
    id: String(assignment.id),
    name: String(assignment.name ?? "Untitled assignment"),
    due_at: typeof assignment.due_at === "string" ? assignment.due_at : null,
    points_possible:
      typeof assignment.points_possible === "number" ? assignment.points_possible : null,
  }));
}

export async function getSyllabus(token: string, courseId: string) {
  const response = await fetch(`${CANVAS_BASE}/courses/${courseId}?include[]=syllabus_body`, {
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (!response.ok) return "";

  const json = (await response.json()) as { syllabus_body?: string };
  return stripHtml(json.syllabus_body ?? "");
}
