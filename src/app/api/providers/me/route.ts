import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import { requireRole } from '@/lib/auth';
import { handleRoute, ok } from '@/lib/apiResponse';

export async function GET() {
  return handleRoute(async () => {
    const session = await requireRole('provider');
    await connectDB();
    const provider = await Provider.findOne({ userId: session.userId }).lean();
    return ok(provider);
  });
}
