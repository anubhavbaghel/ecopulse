import { NextRequest, NextResponse } from 'next/server';
import { generateArchetype, generateSwaps } from '@/lib/gemini';
import { OnboardingAnswers, CategoryType } from '@/types/user';
import { ARCHETYPE_FALLBACKS } from '@/lib/constants';
import { SwapSuggestion } from '@/types/gemini';

// Default fallback swaps when Gemini is unavailable
const FALLBACK_SWAPS: SwapSuggestion[] = [
  {
    title: 'Switch to Plant-Based Mondays',
    from_action: 'Having a meat-based lunch and dinner',
    to_action: 'Enjoying a full plant-based Monday each week',
    co2_saving_kg_per_week: 3.5,
    difficulty: 'easy',
    category: 'diet',
  },
  {
    title: 'Take the Metro to Work',
    from_action: 'Driving solo on your daily commute',
    to_action: 'Taking public transit + 5-min walk',
    co2_saving_kg_per_week: 10.5,
    difficulty: 'medium',
    category: 'transport',
  },
  {
    title: 'Switch to Cold Wash Cycles',
    from_action: 'Washing laundry at 40–60°C',
    to_action: 'Using 30°C cold wash for all loads',
    co2_saving_kg_per_week: 0.6,
    difficulty: 'easy',
    category: 'utilities',
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { endpoint, payload } = body as {
      endpoint: 'archetype' | 'swaps';
      payload: Record<string, unknown>;
    };

    if (endpoint === 'archetype') {
      const answers = payload as unknown as OnboardingAnswers;

      try {
        const result = await generateArchetype(answers);
        return NextResponse.json({ success: true, data: result });
      } catch (geminiErr) {
        console.warn('Gemini unavailable, using fallback archetype:', geminiErr);

        // Fallback logic using predefined archetypes
        const key = `${answers.mobility}-${answers.diet}`;
        const fallback =
          ARCHETYPE_FALLBACKS[key] ?? ARCHETYPE_FALLBACKS['default'];

        return NextResponse.json({
          success: true,
          data: {
            archetype_name: fallback.name,
            archetype_description: fallback.description,
            daily_co2_kg: fallback.daily_co2_kg,
            top_category: answers.mobility === 'car' ? 'transport' : 'diet',
            initial_swaps: FALLBACK_SWAPS,
          },
          fallback: true,
        });
      }
    }

    if (endpoint === 'swaps') {
      const { archetype, topCategory, weeklyAvgCo2 } = payload as {
        archetype: string;
        topCategory: CategoryType;
        weeklyAvgCo2: number;
      };

      try {
        const swaps = await generateSwaps(archetype, topCategory, weeklyAvgCo2);
        return NextResponse.json({ success: true, data: { swaps } });
      } catch (geminiErr) {
        console.warn('Gemini unavailable, using fallback swaps:', geminiErr);
        return NextResponse.json({
          success: true,
          data: { swaps: FALLBACK_SWAPS },
          fallback: true,
        });
      }
    }

    return NextResponse.json({ error: 'Unknown endpoint' }, { status: 400 });
  } catch (err) {
    console.error('Gemini route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
