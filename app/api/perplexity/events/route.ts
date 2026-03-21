import { NextResponse } from "next/server";

import { fetchLocalEvents } from "@/lib/perplexity";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    location?: string;
    date?: string;
    interests?: string[];
  };

  const result = await fetchLocalEvents(
    body.location ?? "Hayward, California",
    body.date ?? new Date().toISOString().slice(0, 10),
    body.interests ?? ["music", "food", "campus events"],
  );

  return NextResponse.json(result);
}
