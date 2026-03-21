export const CANVAS_DOMAIN = "csueastbay.instructure.com";
export const CANVAS_BASE = `https://${CANVAS_DOMAIN}/api/v1`;

/** OAuth redirect path — must match Canvas developer key and getCanvasAuthorizationUrl. */
export const CANVAS_OAUTH_CALLBACK_PATH = "/connect-canvas";

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

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

/** Web origin for this Canvas instance (OAuth + HTML). Uses CANVAS_BASE_URL when set. */
export function getCanvasWebOrigin(): string {
  const base = process.env.CANVAS_BASE_URL?.trim();
  if (base) {
    return base.replace(/\/$/, "");
  }
  return `https://${CANVAS_DOMAIN}`;
}

/** API root `.../api/v1` — uses CANVAS_BASE_URL when set. */
export function getCanvasApiRoot(): string {
  return `${getCanvasWebOrigin()}/api/v1`;
}

export function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * @param redirectUri - Must match the URI registered on your Canvas developer key and the token exchange.
 *   If omitted, uses NEXT_PUBLIC_CANVAS_REDIRECT_URI.
 */
export function getCanvasAuthorizationUrl(redirectUri?: string | null) {
  const clientId = process.env.CANVAS_CLIENT_ID;
  const resolvedRedirect = (redirectUri ?? process.env.NEXT_PUBLIC_CANVAS_REDIRECT_URI)?.trim() || null;

  if (!clientId || !resolvedRedirect) return null;

  const url = new URL(`${getCanvasWebOrigin()}/login/oauth2/auth`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", resolvedRedirect);
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

/**
 * Resolves Canvas HTTP headers for API routes:
 * 1) `x-canvas-token` Bearer (OAuth)
 * 2) `CANVAS_CSRF` + `CANVAS_COOKIE` from environment (server-only; never expose to the client)
 */
export function resolveCanvasAuthHeaders(request: Request): HeadersInit | null {
  const token = request.headers.get("x-canvas-token")?.trim();
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    };
  }

  const csrf = process.env.CANVAS_CSRF?.trim();
  const cookie = process.env.CANVAS_COOKIE?.trim();
  if (csrf && cookie) {
    return {
      accept: "application/json",
      "x-csrf-token": csrf,
      cookie,
      "user-agent": DEFAULT_USER_AGENT,
    };
  }

  return null;
}

export function canvasAuthMissingMessage(): string {
  return "No Canvas auth: add CANVAS_COOKIE and CANVAS_CSRF to .env for session access, or send x-canvas-token (OAuth).";
}

function mapCourseRows(json: Array<Record<string, unknown>>): CanvasCourse[] {
  return json.map((course) => ({
    id: String(course.id),
    name: String(course.name ?? "Untitled course"),
    course_code: typeof course.course_code === "string" ? course.course_code : undefined,
    syllabus_body: typeof course.syllabus_body === "string" ? course.syllabus_body : undefined,
  }));
}

export type GetCoursesResult =
  | { ok: true; courses: CanvasCourse[] }
  | { ok: false; status: number };

/** Loads courses and preserves HTTP status for sync / error UI. */
export async function getCoursesResult(headers: HeadersInit): Promise<GetCoursesResult> {
  const response = await fetch(
    `${getCanvasApiRoot()}/courses?enrollment_state=active&include[]=syllabus_body`,
    { headers, cache: "no-store" },
  );

  if (!response.ok) return { ok: false, status: response.status };

  const json = (await response.json()) as Array<Record<string, unknown>>;
  return { ok: true, courses: mapCourseRows(json) };
}

export async function getCourses(headers: HeadersInit): Promise<CanvasCourse[]> {
  const result = await getCoursesResult(headers);
  return result.ok ? result.courses : [];
}

export async function getAssignments(headers: HeadersInit, courseId: string): Promise<CanvasAssignment[]> {
  const response = await fetch(`${getCanvasApiRoot()}/courses/${courseId}/assignments?per_page=50`, {
    headers,
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

export async function getSyllabus(headers: HeadersInit, courseId: string) {
  const response = await fetch(`${getCanvasApiRoot()}/courses/${courseId}?include[]=syllabus_body`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) return "";

  const json = (await response.json()) as { syllabus_body?: string };
  return stripHtml(json.syllabus_body ?? "");
}
