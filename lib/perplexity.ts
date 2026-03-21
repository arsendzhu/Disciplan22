const PERPLEXITY_ENDPOINT = "https://api.perplexity.ai/chat/completions";

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
    return JSON.parse(text) as T;
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
