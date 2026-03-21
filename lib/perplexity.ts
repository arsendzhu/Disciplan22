const PERPLEXITY_ENDPOINT = "https://api.perplexity.ai/chat/completions";

function stripJsonFence(text: string): string {
  const t = text.trim();
  if (t.startsWith("```")) {
    return t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  }
  return t;
}

async function callPerplexity<T>(prompt: string, fallback: T): Promise<T> {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) return fallback;

  const response = await fetch(PERPLEXITY_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar-pro",
      messages: [{ role: "user", content: `${prompt} Return valid JSON only.` }],
    }),
  });

  if (!response.ok) return fallback;

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = json.choices?.[0]?.message?.content;

  if (!text) return fallback;

  try {
    return JSON.parse(stripJsonFence(text)) as T;
  } catch {
    return fallback;
  }
}

export async function fetchLocalEvents(location: string, date: string, interests: string[]) {
  return callPerplexity(
    `Find real events, activities, and things to do near ${location} this week for a college student on ${date}. Interests: ${interests.join(", ")}. Include free campus events, local music venues, outdoor activities, social events, and food events.`,
    [
      {
        title: "Live Music at The Bistro",
        date,
        time: "8:00 PM",
        location: "Downtown Hayward",
        distance: "0.8 miles",
        cost: "Free",
        source_url: "https://example.com/live-music",
      },
      {
        title: "CSUEB Study Social",
        date: "Friday",
        time: "6:30 PM",
        location: "Pioneer Heights Lounge",
        distance: "On campus",
        cost: "Free",
        source_url: "https://example.com/study-social",
      },
    ],
  );
}

export async function fetchDailyQuote(theme: string) {
  return callPerplexity(
    `Fetch a quote that matches the student's weekly theme: ${theme}. Return JSON with quote and author.`,
    {
      quote:
        "You do not rise to the level of your goals. You fall to the level of your systems.",
      author: "James Clear",
    },
  );
}

export type StudyPlanResult = {
  plan: string;
  notes: string;
};

export async function fetchStudyPlanForAssignment(input: {
  title: string;
  dueDate: string;
  courseName?: string;
}): Promise<StudyPlanResult> {
  const course = input.courseName ? ` Course: ${input.courseName}.` : "";
  return callPerplexity(
    `You are a concise study coach for a college student.${course} Assignment: "${input.title}". Due: ${input.dueDate}.
Return JSON only with this exact shape: {"plan":"string with 4-6 numbered steps in plain text","notes":"string with 2-3 short exam or deliverable tips"}`,
    {
      plan: "1. Skim the rubric.\n2. Draft an outline.\n3. Work in 25-minute blocks.\n4. Proofread before submit.",
      notes: "Start early; ask in office hours if the spec is unclear.",
    },
  );
}
