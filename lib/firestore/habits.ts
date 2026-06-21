import {
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  query,
  where,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Habit, HabitCompletion } from '@/types/habit';
import { DEFAULT_HABITS } from '@/lib/constants';
import { todayString } from '@/lib/utils/date';

const habitsRef = (uid: string) => collection(db, 'users', uid, 'habits');
const completionsRef = (uid: string, habitId: string) =>
  collection(db, 'users', uid, 'habits', habitId, 'completions');

// Seed default habits for new users
export const seedDefaultHabits = async (uid: string): Promise<Habit[]> => {
  const now = new Date().toISOString();
  const seeded: Habit[] = [];

  for (const def of DEFAULT_HABITS) {
    const data: Omit<Habit, 'id'> = {
      userId: uid,
      title: def.title,
      description: def.description,
      co2SavingKg: def.co2SavingKg,
      frequency: def.frequency,
      category: def.category,
      icon: def.icon,
      isActive: true,
      currentStreak: 0,
      longestStreak: 0,
      completedToday: false,
      createdAt: now,
    };
    const ref = await addDoc(habitsRef(uid), data);
    seeded.push({ id: ref.id, ...data });
  }
  return seeded;
};

export const getHabits = async (uid: string): Promise<Habit[]> => {
  const today = todayString();
  const snap = await getDocs(query(habitsRef(uid), where('isActive', '==', true)));
  const habits: Habit[] = [];

  for (const d of snap.docs) {
    const habit = { id: d.id, ...d.data() } as Habit;

    // Check if completed today
    const compRef = doc(completionsRef(uid, d.id), today);
    const compSnap = await getDoc(compRef);
    habit.completedToday = compSnap.exists();

    habits.push(habit);
  }
  return habits;
};

export const completeHabit = async (
  uid: string,
  habitId: string
): Promise<number> => {
  const today = todayString();
  const habitRef = doc(db, 'users', uid, 'habits', habitId);
  const habitSnap = await getDoc(habitRef);
  const habit = habitSnap.data() as Habit;

  const newStreak = habit.currentStreak + 1;
  const newLongest = Math.max(habit.longestStreak, newStreak);

  // Record completion
  await setDoc(doc(completionsRef(uid, habitId), today), {
    habitId,
    userId: uid,
    date: today,
    streakAtCompletion: newStreak,
    completedAt: new Date().toISOString(),
  } satisfies Omit<HabitCompletion, 'id'>);

  // Update streak on habit
  await updateDoc(habitRef, {
    currentStreak: newStreak,
    longestStreak: newLongest,
  });

  return newStreak;
};

export const uncompleteHabit = async (
  uid: string,
  habitId: string
): Promise<void> => {
  const today = todayString();
  const habitRef = doc(db, 'users', uid, 'habits', habitId);
  const habitSnap = await getDoc(habitRef);
  const habit = habitSnap.data() as Habit;

  // Remove today's completion
  await deleteDoc(doc(completionsRef(uid, habitId), today));

  // Decrement streak (min 0)
  const newStreak = Math.max(0, habit.currentStreak - 1);
  await updateDoc(habitRef, { currentStreak: newStreak });
};

// Get last 30 days of completions for a habit (calendar heatmap)
export const getRecentCompletions = async (
  uid: string,
  habitId: string
): Promise<string[]> => {
  const snap = await getDocs(completionsRef(uid, habitId));
  return snap.docs.map((d) => d.id).filter((id) => id.length === 10); // YYYY-MM-DD
};
