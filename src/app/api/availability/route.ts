import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import Availability from '@/models/Availability';
import { availabilitySlotSchema } from '@/lib/validators';
import { requireRole } from '@/lib/auth';
import { handleRoute, created, fail } from '@/lib/apiResponse';

// This is the free scheduling tool — the wedge product. Providers use this
// regardless of whether they're verified yet, since it replaces their paper
// calendar / text-message scheduling.
export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const session = await requireRole('provider');
    await connectDB();

    const provider = await Provider.findOne({ userId: session.userId });
    if (!provider) return fail('Create a provider profile first', 404);

    const input = availabilitySlotSchema.parse(await req.json());

    if (input.startTime >= input.endTime) {
      return fail('startTime must be earlier than endTime', 422);
    }

    const slot = await Availability.create({ ...input, providerId: provider._id });
    return created(slot);
  });
}
