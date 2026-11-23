import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Verification from '@/models/Verification';
import { requireRole } from '@/lib/auth';
import { handleRoute, ok, fail } from '@/lib/apiResponse';

const REVIEW_STATUSES = ['pending', 'verified', 'rejected'] as const;

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    await requireRole('admin');
    await connectDB();

    const { searchParams } = new URL(req.url);
    const requestedStatus = searchParams.get('status') || 'pending';

    if (!REVIEW_STATUSES.includes(requestedStatus as (typeof REVIEW_STATUSES)[number])) {
      return fail('Invalid verification status filter', 400);
    }

    const records = await Verification.find({ status: requestedStatus })
      .populate('providerId')
      .sort({ createdAt: 1 });

    return ok(records);
  });
}
