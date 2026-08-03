import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Verification from '@/models/Verification';
import { requireRole } from '@/lib/auth';
import { handleRoute, ok } from '@/lib/apiResponse';

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    await requireRole('admin');
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';

    const records = await Verification.find({ status }).populate('providerId').sort({ createdAt: 1 });
    return ok(records);
  });
}
