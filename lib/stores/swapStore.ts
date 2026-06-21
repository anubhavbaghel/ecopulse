import { create } from 'zustand';
import { SwapSuggestion } from '@/types/gemini';

interface SwapStore {
  swaps: SwapSuggestion[];
  isLoading: boolean;
  lastUpdated: string | null;

  setSwaps: (swaps: SwapSuggestion[]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useSwapStore = create<SwapStore>()((set) => ({
  swaps: [],
  isLoading: false,
  lastUpdated: null,

  setSwaps: (swaps) =>
    set({ swaps, lastUpdated: new Date().toISOString() }),

  setLoading: (loading) => set({ isLoading: loading }),
  reset: () => set({ swaps: [], isLoading: false, lastUpdated: null }),
}));
