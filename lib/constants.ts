import { CategoryType } from '@/types/user';
import { DefaultHabit } from '@/types/habit';

// ── Daily CO₂ target (global average is ~4kg/day, our goal is half) ──────────
export const DEFAULT_DAILY_TARGET_KG = 8.0; // starting target, full avg
export const GOAL_DAILY_TARGET_KG = 4.0;    // aspirational target

// ── Categories ──────────────────────────────────────────────────────────────
export const CATEGORIES: { id: CategoryType; label: string; icon: string; color: string }[] = [
  { id: 'transport', label: 'Transport', icon: 'Car', color: '#4db8ab' },
  { id: 'diet', label: 'Diet', icon: 'Utensils', color: '#7ea882' },
  { id: 'utilities', label: 'Utilities', icon: 'Zap', color: '#d4a853' },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: '#a08fd4' },
];

// ── Default habits seeded on first login ─────────────────────────────────────
export const DEFAULT_HABITS: DefaultHabit[] = [
  {
    title: 'Meatless Monday',
    description: 'Skip meat for a full day — every week adds up',
    co2SavingKg: 3.5,
    frequency: 'weekly',
    category: 'diet',
    icon: 'Leaf',
  },
  {
    title: 'Cold Wash Cycle',
    description: 'Wash laundry at 30°C instead of 60°C',
    co2SavingKg: 0.6,
    frequency: 'daily',
    category: 'utilities',
    icon: 'Wind',
  },
  {
    title: 'Bike or Walk to Work',
    description: 'Leave the car behind for your commute',
    co2SavingKg: 2.1,
    frequency: 'daily',
    category: 'transport',
    icon: 'Bike',
  },
  {
    title: 'Turn Off Standby',
    description: 'Power down electronics fully instead of standby',
    co2SavingKg: 0.3,
    frequency: 'daily',
    category: 'utilities',
    icon: 'Power',
  },
  {
    title: 'Plant-Based Lunch',
    description: 'Choose a vegetarian or vegan lunch today',
    co2SavingKg: 1.2,
    frequency: 'daily',
    category: 'diet',
    icon: 'Sprout',
  },
  {
    title: 'Skip the Package Delivery',
    description: 'Avoid one online order — shop local instead',
    co2SavingKg: 0.5,
    frequency: 'daily',
    category: 'shopping',
    icon: 'Package',
  },
];

// ── Archetype fallbacks (used when Gemini API is unavailable) ────────────────
export const ARCHETYPE_FALLBACKS: Record<string, { name: string; description: string; daily_co2_kg: number }> = {
  'car-meat-heavy': {
    name: 'The Daily Commuter',
    description: 'You move fast and live full. Your biggest opportunity lies in rethinking your daily commute — even small shifts here create a meaningful ripple effect.',
    daily_co2_kg: 14.2,
  },
  'car-balanced': {
    name: 'The Pragmatic Traveller',
    description: 'You balance convenience with intention. Your commute habits have the most potential for change, and you already show mindfulness in your diet.',
    daily_co2_kg: 11.5,
  },
  'transit-balanced': {
    name: 'The Conscious Urbanite',
    description: 'You make thoughtful choices that already put you ahead of the curve. Small dietary shifts and energy habits will help you go even further.',
    daily_co2_kg: 7.8,
  },
  'bike-plant-based': {
    name: 'The Green Pioneer',
    description: 'You live what you believe. Your footprint is already well below average — focus now on inspiring those around you and optimising your home energy.',
    daily_co2_kg: 4.1,
  },
  'transit-vegan': {
    name: 'The Mindful Minimalist',
    description: 'Intentionality defines you. You have built a lifestyle that others aspire to — your next frontier is household energy and circular shopping habits.',
    daily_co2_kg: 3.8,
  },
  default: {
    name: 'The Aware Individual',
    description: 'You are taking the first step toward understanding your impact. Every action you track here moves the needle — welcome to EcoPulse.',
    daily_co2_kg: 9.5,
  },
};

// ── Equivalence descriptions for impact display ──────────────────────────────
export const EQUIVALENCES = [
  { label: 'tree-months of absorption', factor: 1 / 21.8, icon: '🌳' },
  { label: 'km avoided by car', factor: 1 / 0.171, icon: '🚗' },
  { label: 'hours of LED lighting', factor: 1 / 0.01, icon: '💡' },
  { label: 'plant-based meals', factor: 1 / 0.4, icon: '🥗' },
];
