import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import { providerProfileSchema } from '@/lib/validators';
import { requireSession, AuthError } from '@/lib/auth';
import { handleRoute, ok, fail } from '@/lib/apiResponse';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await connectDB();
    const { id } = await params;
    const provider = await Provider.findById(id);
    if (!provider) return fail('Provider not found', 404);
    return ok(provider);
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const session = await requireSession();
    await connectDB();

    const { id } = await params;
    const provider = await Provider.findById(id);
    if (!provider) return fail('Provider not found', 404);

    if (provider.userId.toString() !== session.userId && session.role !== 'admin') {
      throw new AuthError('You can only edit your own provider profile', 403);
    }

    const input = providerProfileSchema.partial().parse(await req.json());

    if (input.businessName) provider.businessName = input.businessName;
    if (input.trade) provider.trade = input.trade;
    if (input.bio !== undefined) provider.bio = input.bio;
    if (input.yearsInBusiness !== undefined) provider.yearsInBusiness = input.yearsInBusiness;
    if (input.serviceArea) {
      provider.serviceArea = {
        type: 'Point',
        coordinates: [input.serviceArea.lng, input.serviceArea.lat],
      };
      provider.radiusKm = input.serviceArea.radiusKm;
    }

    await provider.save();
    return ok(provider);
  });
}
