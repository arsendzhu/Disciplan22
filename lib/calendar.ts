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
  url.searchParams.set(
    "dates",
    `${input.start.replace(/[-:]/g, "").replace(".000Z", "Z")}/${input.end
      .replace(/[-:]/g, "")
      .replace(".000Z", "Z")}`,
  );
  return url.toString();
}
