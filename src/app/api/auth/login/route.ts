import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { loginSchema } from '@/lib/validators';
import { createSessionToken, setSessionCookie } from '@/lib/auth';
import { verifyPassword } from '@/lib/password';
import { handleRoute, ok, fail } from '@/lib/apiResponse';

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const body = await req.json();
    const input = loginSchema.parse(body);

    await connectDB();

    const user = await User.findOne({ email: input.email });
    if (!user) return fail('Invalid email or password', 401);

    const passwordMatches = await verifyPassword(input.password, user.passwordHash);
    if (!passwordMatches) return fail('Invalid email or password', 401);

    const token = await createSessionToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });
    await setSessionCookie(token);

    return ok({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  });
}
