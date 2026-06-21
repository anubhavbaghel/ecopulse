import { useCarbonStore } from '@/lib/stores/carbonStore';
import { useHabitStore } from '@/lib/stores/habitStore';
import { ActivityEntry } from '@/types/activity';
import { Habit } from '@/types/habit';

const baseActivity = (overrides: Partial<ActivityEntry>): ActivityEntry => ({
  id: 'activity-1',
  userId: 'user-1',
  category: 'transport',
  activityType: 'car_petrol',
  label: 'Car trip',
  quantity: 10,
  unit: 'km',
  co2eKg: 1.71,
  date: '2026-06-21',
  createdAt: '2026-06-21T00:00:00.000Z',
  ...overrides,
});

const baseHabit = (overrides: Partial<Habit>): Habit => ({
  id: 'habit-1',
  userId: 'user-1',
  title: 'Cold Wash Cycle',
  description: 'Wash laundry cold',
  co2SavingKg: 0.6,
  frequency: 'daily',
  category: 'utilities',
  icon: 'Wind',
  isActive: true,
  currentStreak: 2,
  longestStreak: 5,
  completedToday: false,
  createdAt: '2026-06-21T00:00:00.000Z',
  ...overrides,
});

describe('carbon store', () => {
  beforeEach(() => {
    useCarbonStore.getState().reset();
  });

  it('tracks today totals and category totals when activities change', () => {
    useCarbonStore.getState().setActivities([
      baseActivity({ id: 'activity-1', category: 'transport', co2eKg: 1.5 }),
      baseActivity({ id: 'activity-2', category: 'diet', co2eKg: 2.25 }),
    ]);

    expect(useCarbonStore.getState().todayTotalKg).toBe(3.75);
    expect(useCarbonStore.getState().categoryTotals).toMatchObject({
      transport: 1.5,
      diet: 2.25,
      utilities: 0,
      shopping: 0,
    });
  });

  it('adds and removes activities without stale aggregate values', () => {
    const store = useCarbonStore.getState();

    store.addActivity(baseActivity({ id: 'activity-1', co2eKg: 1 }));
    store.addActivity(baseActivity({ id: 'activity-2', category: 'shopping', co2eKg: 4 }));
    useCarbonStore.getState().removeActivity('activity-1');

    expect(useCarbonStore.getState().activities).toHaveLength(1);
    expect(useCarbonStore.getState().todayTotalKg).toBe(4);
    expect(useCarbonStore.getState().categoryTotals.shopping).toBe(4);
    expect(useCarbonStore.getState().categoryTotals.transport).toBe(0);
  });
});

describe('habit store', () => {
  beforeEach(() => {
    useHabitStore.getState().reset();
  });

  it('sets habits and totals streak days', () => {
    useHabitStore.getState().setHabits([
      baseHabit({ id: 'habit-1', currentStreak: 2 }),
      baseHabit({ id: 'habit-2', currentStreak: 4 }),
    ]);

    expect(useHabitStore.getState().hasLoaded).toBe(true);
    expect(useHabitStore.getState().totalStreakDays).toBe(6);
  });

  it('toggles completion and recalculates streak totals', () => {
    useHabitStore.getState().setHabits([
      baseHabit({ id: 'habit-1', currentStreak: 2 }),
      baseHabit({ id: 'habit-2', currentStreak: 4 }),
    ]);

    useHabitStore.getState().toggleComplete('habit-1', true);
    useHabitStore.getState().updateStreak('habit-2', 7);

    expect(useHabitStore.getState().habits[0].completedToday).toBe(true);
    expect(useHabitStore.getState().totalStreakDays).toBe(9);
  });
});
