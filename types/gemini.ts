import { CategoryType } from './user';

export interface SwapSuggestion {
  title: string;
  from_action: string;
  to_action: string;
  co2_saving_kg_per_week: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: CategoryType;
}

export interface ArchetypeResult {
  archetype_name: string;
  archetype_description: string;
  daily_co2_kg: number;
  top_category: CategoryType;
  initial_swaps: SwapSuggestion[];
}

export interface GeminiSwapsResponse {
  swaps: SwapSuggestion[];
}

export type GeminiEndpoint = 'archetype' | 'swaps';

export interface GeminiRequest {
  endpoint: GeminiEndpoint;
  payload: Record<string, unknown>;
}
