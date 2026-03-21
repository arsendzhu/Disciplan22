const ANTHROPIC_ENDPOINT = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL = "claude-sonnet-4-20250514";

type ClaudeResponse = {
  content?: Array<{ type: string; text?: string }>;
};

async function callClaude<T>(system: string, prompt: string, fallback: T): Promise<T> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) return fallback;

  const response = await fetch(ANTHROPIC_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1600,
      system,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) return fallback;

  const json = (await response.json()) as ClaudeResponse;
  const text = json.content?.find((block) => block.type === "text")?.text;

  if (!text) return fallback;

  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function parseSyllabus(syllabusText: string, courseName: string) {
  return callClaude(
    "You are an expert academic advisor parsing a university course syllabus. Extract ALL important dates, deadlines, requirements, and assessments. Pay special attention to dates NOT explicitly listed as Canvas assignments. Return ONLY valid JSON.",
    `Parse this syllabus for ${courseName} and return:
{
  "assignments": [{
    "title": string,
    "due_date": "YYYY-MM-DD or null",
    "type": "exam|quiz|homework|project|reading|participation",
    "points": number or null,
    "estimated_hours": number,
    "difficulty": 0.1-1.0,
    "notes": string or null
  }],
  "exam_dates": ["YYYY-MM-DD"],
  "course_policies": {
    "late_penalty": string or null,
    "attendance_policy": string or null,
    "participation_weight": number or null
  },
  "hidden_deadlines": [string]
}
Syllabus text: ${syllabusText}`,
    {
      assignments: [],
      exam_dates: [],
      course_policies: {
        late_penalty: null,
        attendance_policy: null,
        participation_weight: null,
      },
      hidden_deadlines: [
        "Participation reflection due 2026-04-18",
        "Group checkpoint mentioned only in the syllabus for 2026-04-15",
      ],
    },
  );
}

export async function generateDailyInsight(userData: {
  behaviorSummary: string;
  patterns: string;
  todayContext: string;
}) {
  return callClaude(
    "You are a behavioral psychologist generating personalized insights for a college student based on real productivity data. Your insight must be specific and under 50 words. Return JSON with insight, quote, and author.",
    `Generate today's insight.
Last 7 days of data: ${userData.behaviorSummary}
Patterns: ${userData.patterns}
Today's context: ${userData.todayContext}`,
    {
      insight:
        "You finish 80% of deep work before 2PM but only 20% after 8PM. Move tonight's hardest item into tomorrow's first focus block.",
      quote:
        "We are what we repeatedly do. Excellence, then, is not an act but a habit.",
      author: "Will Durant",
    },
  );
}

export async function parseSiriInput(
  voiceInput: string,
  userCourses: Array<{ id: string; name: string }>,
) {
  return callClaude(
    "Parse a voice-to-text task input from a college student. Extract structured task data. Return ONLY valid JSON.",
    `Parse: "${voiceInput}"
User courses: ${JSON.stringify(userCourses)}
Today's date: ${new Date().toISOString().slice(0, 10)}
Return title, due_date, course_id, estimated_hours, energy_required, confidence.`,
    {
      title: voiceInput,
      due_date: null,
      course_id: userCourses[0]?.id ?? null,
      estimated_hours: 1.5,
      energy_required: "medium",
      confidence: 0.44,
    },
  );
}

export async function getNPCMessage(npcState: string, relevantData: string) {
  const result = await callClaude(
    "You are Sage, a supportive AI study companion living inside a student's workspace. Speak in first person, under 40 words, warm and specific. Return JSON with message.",
    `The student tapped you. Current state: ${npcState}. Their data: ${relevantData}.`,
    {
      message:
        "I can feel the deadline pileup, but your early focus window is still strong. Let me help you protect the next block instead of spiraling.",
    },
  );

  return result.message;
}
