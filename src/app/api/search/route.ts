import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import { searchSchema } from '@/lib/validators';
import { handleRoute, ok } from '@/lib/apiResponse';

const PUBLIC_PROVIDER_FIELDS = 'businessName trade bio yearsInBusiness radiusKm timeZone rating reviewCount verifiedAt createdAt';

// The public marketplace only returns verified providers. Internal account
// identifiers and precise service-area coordinates are never serialized.
export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const input = searchSchema.parse(Object.fromEntries(searchParams));

    const filter: Record<string, unknown> = { verificationStatus: 'verified' };
    if (input.trade) filter.trade = input.trade;
    if (input.minRating !== undefined) filter.rating = { $gte: input.minRating };

    if (input.lat !== undefined && input.lng !== undefined) {
      filter.serviceArea = {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [input.lng, input.lat] },
          $maxDistance: input.radiusKm * 1000,
        },
      };
    }

    const providers = await Provider.find(filter)
      .select(PUBLIC_PROVIDER_FIELDS)
      .limit(50)
      .lean();

    return ok(providers);
  });
}
