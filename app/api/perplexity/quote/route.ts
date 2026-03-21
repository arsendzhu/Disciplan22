import { NextResponse } from "next/server";

import { fetchDailyQuote } from "@/lib/perplexity";

export async function POST(request: Request) {
  const body = (await request.json()) as { theme?: string };
  const result = await fetchDailyQuote(body.theme ?? "growth");
  return NextResponse.json(result);
}
