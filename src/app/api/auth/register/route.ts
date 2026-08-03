import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { registerSchema } from '@/lib/validators';
import { createSessionToken, setSessionCookie } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { handleRoute, created, fail } from '@/lib/apiResponse';

// This route uses bcrypt, so it must run on the Node.js runtime (the default).
export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const body = await req.json();
    const input = registerSchema.parse(body);

    await connectDB();

    const existing = await User.findOne({ email: input.email });
    if (existing) {
      return fail('An account with this email already exists', 409);
    }

    const passwordHash = await hashPassword(input.password);
    const user = await User.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      phone: input.phone,
    });

    const token = await createSessionToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });
    await setSessionCookie(token);

    return created({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  });
}
