import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Availability from '@/models/Availability';
import { handleRoute, ok } from '@/lib/apiResponse';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ providerId: string }> }) {
  return handleRoute(async () => {
    await connectDB();
    const { providerId } = await params;
    const slots = await Availability.find({ providerId }).sort({ dayOfWeek: 1, startTime: 1 });
    return ok(slots);
  });
}
