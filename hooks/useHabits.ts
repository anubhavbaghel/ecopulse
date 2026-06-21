'use client';

import { useEffect, useCallback } from 'react';
import { useHabitStore } from '@/lib/stores/habitStore';
import { useAuthStore } from '@/lib/stores/authStore';
import {
  getHabits,
  completeHabit,
  uncompleteHabit,
  seedDefaultHabits,
} from '@/lib/firestore/habits';

export const useHabits = () => {
  const { habits, isLoading, hasLoaded, setHabits, toggleComplete, updateStreak, setLoading } =
    useHabitStore();
  const { user } = useAuthStore();

  const loadHabits = useCallback(async () => {
    if (!user || hasLoaded) return;
    setLoading(true);
    try {
      let loaded = await getHabits(user.uid);
      if (loaded.length === 0) {
        loaded = await seedDefaultHabits(user.uid);
      }
      setHabits(loaded);
    } catch (err) {
      console.error('Failed to load habits:', err);
    } finally {
      setLoading(false);
    }
  }, [user, hasLoaded]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const handleToggle = async (habitId: string, currentlyCompleted: boolean) => {
    if (!user) return;
    // Optimistic update
    toggleComplete(habitId, !currentlyCompleted);
    try {
      if (!currentlyCompleted) {
        const newStreak = await completeHabit(user.uid, habitId);
        updateStreak(habitId, newStreak);
      } else {
        await uncompleteHabit(user.uid, habitId);
        const habit = habits.find((h) => h.id === habitId);
        if (habit) updateStreak(habitId, Math.max(0, habit.currentStreak - 1));
      }
    } catch (err) {
      // Revert on failure
      toggleComplete(habitId, currentlyCompleted);
      console.error('Failed to toggle habit:', err);
    }
  };

  return { habits, isLoading, handleToggle, reload: loadHabits };
};
