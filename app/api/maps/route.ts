import { NextRequest, NextResponse } from 'next/server';
import { MOCK_ROUTES } from '@/lib/maps-mock';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const routeId = searchParams.get('routeId') ?? 'commute-main';

  const route = MOCK_ROUTES.find((r) => r.id === routeId);

  if (!route) {
    return NextResponse.json({ error: 'Route not found' }, { status: 404 });
  }

  // Simulate API latency for realism
  await new Promise((r) => setTimeout(r, 200));

  return NextResponse.json({
    success: true,
    data: route,
    source: 'mock-google-maps-routes-api',
    disclaimer: 'Simulated data — Google Maps Routes API mock',
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { origin, destination } = body as { origin: string; destination: string };

  // Return the closest matching mock route
  const route = MOCK_ROUTES[0];

  return NextResponse.json({
    success: true,
    data: {
      ...route,
      origin: origin || route.origin,
      destination: destination || route.destination,
    },
    source: 'mock-google-maps-routes-api',
  });
}
