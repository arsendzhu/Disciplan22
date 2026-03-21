import type { CanvasAssignment, CanvasCourse } from "@/lib/canvas";
import type { Assignment, Course } from "@/store/canvasStore";

const PALETTE = [
  "#E8C97A",
  "#8BA7D4",
  "#7EC8A4",
  "#C98B6A",
  "#9B8FD9",
  "#5DADE2",
  "#D4A5A5",
];

function hashColor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function isDueWithinDays(dueIso: string, days: number): boolean {
  const due = new Date(dueIso);
  const now = new Date();
  const end = new Date(now.getTime() + days * 86400000);
  return due >= now && due <= end;
}

/**
 * Maps Canvas API models into DisciPlan canvas store rows.
 */
export function mapCanvasSyncToStore(
  courses: CanvasCourse[],
  assignmentsByCourse: Map<string, CanvasAssignment[]>,
): { courses: Course[]; assignments: Assignment[] } {
  const coursesOut: Course[] = [];
  const assignmentsOut: Assignment[] = [];

  for (const c of courses) {
    const raw = assignmentsByCourse.get(c.id) ?? [];
    const withDue = raw.filter((a): a is typeof a & { due_at: string } => Boolean(a.due_at));
    const upcoming = withDue.filter((a) => new Date(a.due_at) >= new Date());
    const dueThisWeek = upcoming.filter((a) => isDueWithinDays(a.due_at, 7)).length;

    coursesOut.push({
      id: c.id,
      name: c.name,
      courseCode: c.course_code ?? c.name,
      professorName: "—",
      color: hashColor(c.id),
      dueThisWeek,
    });

    const sorted = [...upcoming].sort(
      (x, y) => new Date(x.due_at).getTime() - new Date(y.due_at).getTime(),
    );

    for (const a of sorted) {
      const points = a.points_possible;
      const difficulty =
        typeof points === "number" && points > 0 ? Math.min(0.95, 0.15 + points / 100) : 0.5;

      assignmentsOut.push({
        id: `${c.id}-${a.id}`,
        courseId: c.id,
        title: a.name,
        dueDate: a.due_at,
        estimatedHours: 1,
        difficulty,
        status: "pending",
        source: "canvas",
      });
    }
  }

  return { courses: coursesOut, assignments: assignmentsOut };
}
