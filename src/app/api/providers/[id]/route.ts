import { NextRequest } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import { providerProfileSchema } from '@/lib/validators';
import { requireSession, AuthError } from '@/lib/auth';
import { handleRoute, ok, fail } from '@/lib/apiResponse';

const PUBLIC_PROVIDER_FIELDS = 'businessName trade bio yearsInBusiness radiusKm timeZone rating reviewCount verifiedAt createdAt';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await connectDB();
    const { id } = await params;
    if (!isValidObjectId(id)) return fail('Provider not found', 404);

    const provider = await Provider.findOne({ _id: id, verificationStatus: 'verified' })
      .select(PUBLIC_PROVIDER_FIELDS)
      .lean();
    if (!provider) return fail('Provider not found', 404);
    return ok(provider);
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const session = await requireSession();
    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail('Provider not found', 404);
    const provider = await Provider.findById(id);
    if (!provider) return fail('Provider not found', 404);

    if (provider.userId.toString() !== session.userId && session.role !== 'admin') {
      throw new AuthError('You can only edit your own provider profile', 403);
    }

    const input = providerProfileSchema.partial().parse(await req.json());

    // A verified badge is tied to the business identity and operating area
    // that were reviewed. Material changes must trigger a fresh review.
    const businessIdentityChanged =
      (input.businessName !== undefined && input.businessName !== provider.businessName) ||
      (input.trade !== undefined && input.trade !== provider.trade) ||
      (input.serviceArea !== undefined &&
        (input.serviceArea.lng !== provider.serviceArea.coordinates[0] ||
          input.serviceArea.lat !== provider.serviceArea.coordinates[1] ||
          input.serviceArea.radiusKm !== provider.radiusKm));

    // Do not let a provider change the identity/operating area while an
    // administrator is reviewing documents for the current profile.
    if (businessIdentityChanged && provider.verificationStatus === 'pending') {
      return fail('Profile identity cannot be changed while verification is pending. Wait for the review to finish.', 409);
    }

    if (input.businessName !== undefined) provider.businessName = input.businessName;
    if (input.trade !== undefined) provider.trade = input.trade;
    if (input.bio !== undefined) provider.bio = input.bio;
    if (input.timeZone !== undefined) provider.timeZone = input.timeZone;
    if (input.yearsInBusiness !== undefined) provider.yearsInBusiness = input.yearsInBusiness;
    if (input.serviceArea !== undefined) {
      provider.serviceArea = {
        type: 'Point',
        coordinates: [input.serviceArea.lng, input.serviceArea.lat],
      };
      provider.radiusKm = input.serviceArea.radiusKm;
    }

    if (businessIdentityChanged && provider.verificationStatus === 'verified') {
      provider.verificationStatus = 'unverified';
      provider.verifiedAt = undefined;
    }

    await provider.save();
    return ok(provider);
  });
}
