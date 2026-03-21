/** Google Calendar `dates` param: UTC compact form YYYYMMDDTHHmmssZ */
function formatGcalUtc(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(
    d.getUTCMinutes(),
  )}${p(d.getUTCSeconds())}Z`;
}

export function buildGoogleCalendarUrl(input: {
  title: string;
  details?: string;
  location?: string;
  start: string;
  end: string;
}) {
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", input.title);
  url.searchParams.set("details", input.details ?? "");
  url.searchParams.set("location", input.location ?? "");
  url.searchParams.set("dates", `${formatGcalUtc(input.start)}/${formatGcalUtc(input.end)}`);
  return url.toString();
}

/** Study block ending at the assignment due time (default 90 minutes). */
export function buildGoogleCalendarUrlForAssignment(input: {
  title: string;
  dueIso: string;
  courseName?: string;
  blockMinutes?: number;
}) {
  const due = new Date(input.dueIso);
  const block = input.blockMinutes ?? 90;
  const start = new Date(due.getTime() - block * 60 * 1000);
  const title = input.courseName ? `${input.title} (${input.courseName})` : input.title;
  return buildGoogleCalendarUrl({
    title,
    details: "Added from DisciPlan (Canvas).",
    start: start.toISOString(),
    end: due.toISOString(),
  });
}
