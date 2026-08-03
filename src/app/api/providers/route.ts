import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import { providerProfileSchema } from '@/lib/validators';
import { requireRole } from '@/lib/auth';
import { handleRoute, created, ok, fail } from '@/lib/apiResponse';

// Create a provider profile. Caller must be logged in with role 'provider'.
// A provider starts as 'unverified' — they won't show up in marketplace
// search until an admin approves their verification documents.
export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const session = await requireRole('provider');
    const body = await req.json();
    const input = providerProfileSchema.parse(body);

    await connectDB();

    const existing = await Provider.findOne({ userId: session.userId });
    if (existing) return fail('Provider profile already exists for this account', 409);

    const provider = await Provider.create({
      userId: session.userId,
      businessName: input.businessName,
      trade: input.trade,
      bio: input.bio,
      yearsInBusiness: input.yearsInBusiness,
      serviceArea: {
        type: 'Point',
        coordinates: [input.serviceArea.lng, input.serviceArea.lat],
      },
      radiusKm: input.serviceArea.radiusKm,
      verificationStatus: 'unverified',
    });

    return created(provider);
  });
}

// Basic listing (non-geo). For location-based marketplace search, use
// /api/search instead — this endpoint is mainly for back-office use.
export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const trade = searchParams.get('trade');
    const status = searchParams.get('verificationStatus') || 'verified';

    const filter: Record<string, unknown> = { verificationStatus: status };
    if (trade) filter.trade = trade;

    const providers = await Provider.find(filter).sort({ rating: -1 }).limit(100);
    return ok(providers);
  });
}
