import { CategoryType } from './user';

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string;
  co2SavingKg: number;
  frequency: 'daily' | 'weekly';
  category: CategoryType;
  icon: string;
  isActive: boolean;
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  createdAt: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  streakAtCompletion: number;
  completedAt: string;
}

export interface DefaultHabit {
  title: string;
  description: string;
  co2SavingKg: number;
  frequency: 'daily' | 'weekly';
  category: CategoryType;
  icon: string;
}
