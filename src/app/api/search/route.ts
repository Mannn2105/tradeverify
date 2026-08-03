import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import { searchSchema } from '@/lib/validators';
import { handleRoute, ok } from '@/lib/apiResponse';

// This is the actual marketplace: the ONLY endpoint customers use to
// discover providers, and it hard-filters to verificationStatus: 'verified'.
// This is what makes "verified" mean something — an unverified or pending
// provider can use the scheduling tool, but is invisible here.
export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const input = searchSchema.parse(Object.fromEntries(searchParams));

    const filter: Record<string, unknown> = { verificationStatus: 'verified' };
    if (input.trade) filter.trade = input.trade;
    if (input.minRating) filter.rating = { $gte: input.minRating };

    // Geo search: only applied if lat/lng were provided.
    if (input.lat !== undefined && input.lng !== undefined) {
      filter.serviceArea = {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [input.lng, input.lat] },
          $maxDistance: input.radiusKm * 1000, // meters
        },
      };
    }

    const providers = await Provider.find(filter).limit(50);
    return ok(providers);
  });
}
