// Mock Google Maps Routes API
// Simulates real-time transit vs driving comparisons for the user's commute

export interface RouteOption {
  mode: 'driving' | 'transit' | 'cycling' | 'walking';
  label: string;
  icon: string;
  duration_min: number;
  distance_km: number;
  co2_kg: number;
  cost_estimate?: string;
  route_name?: string;
}

export interface MockRoute {
  id: string;
  origin: string;
  destination: string;
  purpose: string;
  options: RouteOption[];
}

export const MOCK_ROUTES: MockRoute[] = [
  {
    id: 'commute-main',
    origin: 'Home',
    destination: 'Office / Work',
    purpose: 'Daily Commute',
    options: [
      {
        mode: 'driving',
        label: 'Drive (Petrol)',
        icon: 'Car',
        duration_min: 25,
        distance_km: 12.3,
        co2_kg: 2.10,
        cost_estimate: '₹85',
        route_name: 'Via Ring Road',
      },
      {
        mode: 'transit',
        label: 'Metro + Walk',
        icon: 'TrainFront',
        duration_min: 38,
        distance_km: 14.1,
        co2_kg: 0.29,
        cost_estimate: '₹35',
        route_name: 'Line 2 → Blue Line',
      },
      {
        mode: 'cycling',
        label: 'Bike',
        icon: 'Bike',
        duration_min: 50,
        distance_km: 11.8,
        co2_kg: 0.0,
        cost_estimate: '₹0',
        route_name: 'Cycle track route',
      },
    ],
  },
  {
    id: 'grocery-run',
    origin: 'Home',
    destination: 'Supermarket',
    purpose: 'Grocery Run',
    options: [
      {
        mode: 'driving',
        label: 'Drive',
        icon: 'Car',
        duration_min: 10,
        distance_km: 3.2,
        co2_kg: 0.55,
        cost_estimate: '₹22',
      },
      {
        mode: 'transit',
        label: 'Bus',
        icon: 'Bus',
        duration_min: 18,
        distance_km: 3.8,
        co2_kg: 0.17,
        cost_estimate: '₹10',
      },
      {
        mode: 'walking',
        label: 'Walk',
        icon: 'Footprints',
        duration_min: 28,
        distance_km: 2.9,
        co2_kg: 0.0,
        cost_estimate: '₹0',
      },
    ],
  },
];

export const getRouteComparison = (routeId: string): MockRoute | undefined =>
  MOCK_ROUTES.find((r) => r.id === routeId);

export const getCommuteSavingPotential = (routeId: string): number => {
  const route = getRouteComparison(routeId);
  if (!route) return 0;
  const driving = route.options.find((o) => o.mode === 'driving');
  const best = route.options.reduce((min, o) => (o.co2_kg < min.co2_kg ? o : min));
  if (!driving) return 0;
  return parseFloat(((driving.co2_kg - best.co2_kg) * 5 * 52).toFixed(1)); // yearly saving
};
