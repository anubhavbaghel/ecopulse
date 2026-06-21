import { CategoryType } from './user';

export type { CategoryType };

export interface ActivityEntry {
  id: string;
  userId: string;
  category: CategoryType;
  activityType: string;
  label: string;
  quantity: number;
  unit: string;
  co2eKg: number;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: string;
}

export interface CategorySummary {
  category: CategoryType;
  totalCo2eKg: number;
  entries: ActivityEntry[];
  percentOfTotal: number;
}

export interface DailySummary {
  date: string;
  totalCo2eKg: number;
  categories: Record<CategoryType, number>;
  entries: ActivityEntry[];
}

export interface ActivityInput {
  category: CategoryType;
  activityType: string;
  quantity: number;
  unit: string;
  label: string;
}
