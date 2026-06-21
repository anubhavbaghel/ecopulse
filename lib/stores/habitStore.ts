import { create } from 'zustand';
import { Habit } from '@/types/habit';

interface HabitStore {
  habits: Habit[];
  totalStreakDays: number;
  isLoading: boolean;

  setHabits: (habits: Habit[]) => void;
  toggleComplete: (habitId: string, completed: boolean) => void;
  updateStreak: (habitId: string, streak: number) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useHabitStore = create<HabitStore>()((set) => ({
  habits: [],
  totalStreakDays: 0,
  isLoading: false,

  setHabits: (habits) =>
    set({
      habits,
      totalStreakDays: habits.reduce((s, h) => s + h.currentStreak, 0),
    }),

  toggleComplete: (habitId, completed) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === habitId ? { ...h, completedToday: completed } : h
      ),
    })),

  updateStreak: (habitId, streak) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === habitId ? { ...h, currentStreak: streak } : h
      ),
      totalStreakDays: state.habits.reduce(
        (s, h) => s + (h.id === habitId ? streak : h.currentStreak),
        0
      ),
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  reset: () => set({ habits: [], totalStreakDays: 0, isLoading: false }),
}));
