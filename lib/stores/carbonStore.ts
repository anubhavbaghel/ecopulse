import { create } from 'zustand';
import { ActivityEntry, CategoryType } from '@/types/activity';
import { DEFAULT_DAILY_TARGET_KG } from '@/lib/constants';

type CategoryTotals = Record<CategoryType, number>;

interface CarbonStore {
  activities: ActivityEntry[];
  todayTotalKg: number;
  dailyTargetKg: number;
  categoryTotals: CategoryTotals;
  weeklyData: number[]; // last 7 days, oldest first
  isLoading: boolean;

  setActivities: (activities: ActivityEntry[]) => void;
  addActivity: (entry: ActivityEntry) => void;
  removeActivity: (id: string) => void;
  setDailyTarget: (kg: number) => void;
  setWeeklyData: (data: number[]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const emptyCategoryTotals = (): CategoryTotals => ({
  transport: 0,
  diet: 0,
  utilities: 0,
  shopping: 0,
});

const sumCategoryTotals = (activities: ActivityEntry[]): CategoryTotals => {
  const totals = emptyCategoryTotals();
  for (const a of activities) {
    totals[a.category] = (totals[a.category] || 0) + a.co2eKg;
  }
  return totals;
};

export const useCarbonStore = create<CarbonStore>()((set) => ({
  activities: [],
  todayTotalKg: 0,
  dailyTargetKg: DEFAULT_DAILY_TARGET_KG,
  categoryTotals: emptyCategoryTotals(),
  weeklyData: [0, 0, 0, 0, 0, 0, 0],
  isLoading: false,

  setActivities: (activities) =>
    set({
      activities,
      todayTotalKg: activities.reduce((s, a) => s + a.co2eKg, 0),
      categoryTotals: sumCategoryTotals(activities),
    }),

  addActivity: (entry) =>
    set((state) => {
      const activities = [...state.activities, entry];
      return {
        activities,
        todayTotalKg: state.todayTotalKg + entry.co2eKg,
        categoryTotals: sumCategoryTotals(activities),
      };
    }),

  removeActivity: (id) =>
    set((state) => {
      const activities = state.activities.filter((a) => a.id !== id);
      return {
        activities,
        todayTotalKg: activities.reduce((s, a) => s + a.co2eKg, 0),
        categoryTotals: sumCategoryTotals(activities),
      };
    }),

  setDailyTarget: (kg) => set({ dailyTargetKg: kg }),
  setWeeklyData: (data) => set({ weeklyData: data }),
  setLoading: (loading) => set({ isLoading: loading }),
  reset: () =>
    set({
      activities: [],
      todayTotalKg: 0,
      categoryTotals: emptyCategoryTotals(),
      weeklyData: [0, 0, 0, 0, 0, 0, 0],
      isLoading: false,
    }),
}));
