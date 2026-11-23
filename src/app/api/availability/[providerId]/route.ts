import { NextRequest } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import Availability from '@/models/Availability';
import { handleRoute, ok, fail } from '@/lib/apiResponse';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ providerId: string }> }) {
  return handleRoute(async () => {
    await connectDB();
    const { providerId } = await params;
    if (!isValidObjectId(providerId)) return fail('Provider not found', 404);

    const provider = await Provider.findOne({
      _id: providerId,
      verificationStatus: 'verified',
    }).select('_id');

    if (!provider) return fail('Provider not found', 404);

    const slots = await Availability.find({ providerId: provider._id })
      .select('dayOfWeek startTime endTime')
      .sort({ dayOfWeek: 1, startTime: 1 })
      .lean();

    return ok(slots);
  });
}
