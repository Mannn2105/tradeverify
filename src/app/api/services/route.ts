import { NextRequest } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import Service from '@/models/Service';
import { serviceSchema } from '@/lib/validators';
import { requireRole } from '@/lib/auth';
import { handleRoute, created, ok, fail } from '@/lib/apiResponse';

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const session = await requireRole('provider');
    await connectDB();

    const provider = await Provider.findOne({ userId: session.userId });
    if (!provider) return fail('Create a provider profile before adding services', 404);

    const input = serviceSchema.parse(await req.json());
    const service = await Service.create({ ...input, providerId: provider._id });
    return created(service);
  });
}

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get('providerId');
    if (!providerId || !isValidObjectId(providerId)) {
      return fail('A valid providerId query param is required', 400);
    }

    const provider = await Provider.findOne({
      _id: providerId,
      verificationStatus: 'verified',
    }).select('_id');

    if (!provider) return fail('Provider not found', 404);

    const services = await Service.find({ providerId: provider._id, active: true })
      .select('title description category priceType price durationMinutes active createdAt')
      .lean();

    return ok(services);
  });
}
