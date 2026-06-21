import { CategoryType } from '@/types/user';

export interface EmissionFactor {
  id: string;
  label: string;
  unit: string;
  co2eKgPerUnit: number;
  category: CategoryType;
}

// Verified emission factors (BEIS 2024 / IPCC AR6)
export const EMISSION_FACTORS: EmissionFactor[] = [
  // ── TRANSPORT ─────────────────────────────────────────────────────────────
  { id: 'car_petrol', label: 'Car (Petrol)', unit: 'km', co2eKgPerUnit: 0.171, category: 'transport' },
  { id: 'car_diesel', label: 'Car (Diesel)', unit: 'km', co2eKgPerUnit: 0.159, category: 'transport' },
  { id: 'car_electric', label: 'Car (Electric)', unit: 'km', co2eKgPerUnit: 0.053, category: 'transport' },
  { id: 'car_hybrid', label: 'Car (Hybrid)', unit: 'km', co2eKgPerUnit: 0.108, category: 'transport' },
  { id: 'motorcycle', label: 'Motorcycle', unit: 'km', co2eKgPerUnit: 0.114, category: 'transport' },
  { id: 'bus', label: 'Bus', unit: 'km', co2eKgPerUnit: 0.089, category: 'transport' },
  { id: 'train', label: 'Train / Metro', unit: 'km', co2eKgPerUnit: 0.041, category: 'transport' },
  { id: 'tram', label: 'Tram', unit: 'km', co2eKgPerUnit: 0.029, category: 'transport' },
  { id: 'flight_short', label: 'Flight (Short-haul < 3h)', unit: 'km', co2eKgPerUnit: 0.255, category: 'transport' },
  { id: 'flight_long', label: 'Flight (Long-haul > 3h)', unit: 'km', co2eKgPerUnit: 0.195, category: 'transport' },
  { id: 'ferry', label: 'Ferry', unit: 'km', co2eKgPerUnit: 0.113, category: 'transport' },
  { id: 'rideshare', label: 'Rideshare / Taxi', unit: 'km', co2eKgPerUnit: 0.149, category: 'transport' },

  // ── DIET ──────────────────────────────────────────────────────────────────
  { id: 'beef_meal', label: 'Beef Meal', unit: 'meal', co2eKgPerUnit: 3.5, category: 'diet' },
  { id: 'lamb_meal', label: 'Lamb Meal', unit: 'meal', co2eKgPerUnit: 2.8, category: 'diet' },
  { id: 'pork_meal', label: 'Pork Meal', unit: 'meal', co2eKgPerUnit: 1.2, category: 'diet' },
  { id: 'chicken_meal', label: 'Chicken Meal', unit: 'meal', co2eKgPerUnit: 0.9, category: 'diet' },
  { id: 'fish_meal', label: 'Fish / Seafood Meal', unit: 'meal', co2eKgPerUnit: 0.8, category: 'diet' },
  { id: 'vegetarian_meal', label: 'Vegetarian Meal', unit: 'meal', co2eKgPerUnit: 0.4, category: 'diet' },
  { id: 'vegan_meal', label: 'Vegan Meal', unit: 'meal', co2eKgPerUnit: 0.25, category: 'diet' },
  { id: 'dairy_portion', label: 'Dairy (milk/cheese/yogurt)', unit: 'portion', co2eKgPerUnit: 0.45, category: 'diet' },
  { id: 'coffee', label: 'Coffee / Espresso', unit: 'cup', co2eKgPerUnit: 0.28, category: 'diet' },

  // ── UTILITIES ─────────────────────────────────────────────────────────────
  { id: 'electricity', label: 'Electricity (grid)', unit: 'kWh', co2eKgPerUnit: 0.233, category: 'utilities' },
  { id: 'electricity_renewable', label: 'Electricity (renewable)', unit: 'kWh', co2eKgPerUnit: 0.022, category: 'utilities' },
  { id: 'natural_gas', label: 'Natural Gas', unit: 'm³', co2eKgPerUnit: 2.04, category: 'utilities' },
  { id: 'heating_oil', label: 'Heating Oil', unit: 'litre', co2eKgPerUnit: 2.68, category: 'utilities' },
  { id: 'hot_shower_10min', label: 'Hot Shower (10 min)', unit: 'shower', co2eKgPerUnit: 0.48, category: 'utilities' },
  { id: 'tumble_dryer', label: 'Tumble Dryer (cycle)', unit: 'cycle', co2eKgPerUnit: 1.8, category: 'utilities' },
  { id: 'washing_machine_warm', label: 'Washing Machine (warm 40°C)', unit: 'cycle', co2eKgPerUnit: 0.6, category: 'utilities' },
  { id: 'washing_machine_cold', label: 'Washing Machine (cold 30°C)', unit: 'cycle', co2eKgPerUnit: 0.11, category: 'utilities' },
  { id: 'dishwasher', label: 'Dishwasher (cycle)', unit: 'cycle', co2eKgPerUnit: 0.7, category: 'utilities' },

  // ── SHOPPING ──────────────────────────────────────────────────────────────
  { id: 'clothing_item', label: 'New Clothing Item', unit: 'item', co2eKgPerUnit: 10.0, category: 'shopping' },
  { id: 'jeans', label: 'New Pair of Jeans', unit: 'pair', co2eKgPerUnit: 33.4, category: 'shopping' },
  { id: 'tshirt', label: 'New T-Shirt', unit: 'item', co2eKgPerUnit: 5.5, category: 'shopping' },
  { id: 'online_delivery', label: 'Online Order (delivery)', unit: 'parcel', co2eKgPerUnit: 0.5, category: 'shopping' },
  { id: 'smartphone', label: 'New Smartphone', unit: 'device', co2eKgPerUnit: 70.0, category: 'shopping' },
  { id: 'laptop', label: 'New Laptop', unit: 'device', co2eKgPerUnit: 156.0, category: 'shopping' },
  { id: 'fast_food', label: 'Fast Food Meal (packaged)', unit: 'meal', co2eKgPerUnit: 2.3, category: 'shopping' },
];

// Helper: get factor by ID
export const getEmissionFactor = (id: string): EmissionFactor | undefined =>
  EMISSION_FACTORS.find((f) => f.id === id);

// Helper: get all factors for a category
export const getFactorsByCategory = (category: CategoryType): EmissionFactor[] =>
  EMISSION_FACTORS.filter((f) => f.category === category);

// Helper: calculate CO₂ for a given activity
export const calculateCo2 = (factorId: string, quantity: number): number => {
  const factor = getEmissionFactor(factorId);
  if (!factor) return 0;
  return parseFloat((factor.co2eKgPerUnit * quantity).toFixed(3));
};
