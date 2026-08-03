import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { requireSession } from '@/lib/auth';
import { handleRoute, ok } from '@/lib/apiResponse';

export async function GET() {
  return handleRoute(async () => {
    const session = await requireSession();
    await connectDB();
    const user = await User.findById(session.userId).select('-passwordHash');
    return ok(user);
  });
}
