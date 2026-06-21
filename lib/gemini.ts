import { ArchetypeResult, SwapSuggestion } from '@/types/gemini';
import { OnboardingAnswers, CategoryType } from '@/types/user';

// ── Server-side Gemini client (called from Route Handlers only) ───────────────

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';

interface GeminiTextPart {
  text: string;
}

interface GeminiContent {
  parts: GeminiTextPart[];
}

interface GeminiCandidate {
  content: GeminiContent;
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

const callGemini = async (prompt: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not set');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
  }

  const data: GeminiResponse = await res.json();
  return data.candidates[0]?.content?.parts[0]?.text ?? '';
};

// ── Prompt builders ───────────────────────────────────────────────────────────

export const buildArchetypePrompt = (answers: OnboardingAnswers): string => `
You are an expert carbon footprint analyst. Based on these lifestyle answers, generate a JSON response.

User answers:
- Primary mobility: ${answers.mobility}
- Diet style: ${answers.diet}
- Home size: ${answers.homeSize}
- Uses renewable energy: ${answers.renewable}

Respond with ONLY valid JSON (no markdown, no explanation) matching this exact schema:
{
  "archetype_name": "string (max 4 words, evocative and positive)",
  "archetype_description": "string (2 sentences, warm and encouraging tone — no climate doom language)",
  "daily_co2_kg": number (realistic daily CO2e estimate in kg based on the lifestyle),
  "top_category": "transport" | "diet" | "utilities" | "shopping",
  "initial_swaps": [
    {
      "title": "string",
      "from_action": "string (what they currently do)",
      "to_action": "string (the better alternative)",
      "co2_saving_kg_per_week": number,
      "difficulty": "easy" | "medium" | "hard",
      "category": "transport" | "diet" | "utilities" | "shopping"
    }
  ] (exactly 3 items)
}
`;

export const buildSwapsPrompt = (
  archetype: string,
  topCategory: CategoryType,
  weeklyAvgCo2: number
): string => `
You are an expert sustainability advisor. Generate personalized, actionable carbon-reduction suggestions.

User profile:
- Lifestyle archetype: ${archetype}
- Highest impact area: ${topCategory}
- Weekly average CO2e: ${weeklyAvgCo2.toFixed(1)} kg

Generate 3 highly specific "Swaps" (from → to alternatives). Respond with ONLY valid JSON:
{
  "swaps": [
    {
      "title": "string (action name, 5 words max)",
      "from_action": "string (what they currently do, specific)",
      "to_action": "string (the better alternative, specific)",
      "co2_saving_kg_per_week": number,
      "difficulty": "easy" | "medium" | "hard",
      "category": "transport" | "diet" | "utilities" | "shopping"
    }
  ]
}

Rules:
- Tone: Positive, encouraging, practical — never shaming
- Make them specific to the top category first (2 out of 3)
- Ensure CO2 savings are realistic
`;

// ── Public API ────────────────────────────────────────────────────────────────

export const generateArchetype = async (
  answers: OnboardingAnswers
): Promise<ArchetypeResult> => {
  const text = await callGemini(buildArchetypePrompt(answers));
  return JSON.parse(text) as ArchetypeResult;
};

export const generateSwaps = async (
  archetype: string,
  topCategory: CategoryType,
  weeklyAvgCo2: number
): Promise<SwapSuggestion[]> => {
  const prompt = buildSwapsPrompt(archetype, topCategory, weeklyAvgCo2);
  const text = await callGemini(prompt);
  const parsed = JSON.parse(text) as { swaps: SwapSuggestion[] };
  return parsed.swaps;
};
