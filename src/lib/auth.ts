import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { HttpError } from './http-error';

export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'tradeverify_session';

export type SessionPayload = {
  userId: string;
  role: 'customer' | 'provider' | 'admin';
  email: string;
};

// Password hashing (hashPassword / verifyPassword) lives in ./password.ts —
// kept out of this file on purpose. proxy.ts imports from auth.ts, and the
// proxy runs separately from route handlers; bcrypt's Node-only APIs must
// never be pulled into the proxy bundle.

// ---------- JWT session tokens ----------
// jose is edge-compatible, so these functions can be called from both
// route handlers (Node runtime) and proxy.ts.
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Secret is resolved lazily so importing this module never fails at build
// time when JWT_SECRET is missing from the environment.
function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing JWT_SECRET environment variable. Add it to .env.local');
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    });

    // A valid signature is not enough: only accept the exact session shape
    // issued by createSessionToken before route handlers trust its claims.
    const userId = payload.userId;
    const role = payload.role;
    const email = payload.email;

    if (
      typeof userId !== 'string' ||
      !/^[a-f0-9]{24}$/i.test(userId) ||
      (role !== 'customer' && role !== 'provider' && role !== 'admin') ||
      typeof email !== 'string' ||
      email.length === 0
    ) {
      return null;
    }

    return { userId, role, email };
  } catch {
    return null;
  }
}

// ---------- Cookie helpers for use inside Route Handlers ----------
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

// Reads + verifies the session from within a Route Handler.
// Returns null if there's no session or it's invalid/expired.
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export class AuthError extends HttpError {
  constructor(message: string, status = 401) {
    super(message, status);
    this.name = 'AuthError';
  }
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new AuthError('Not authenticated', 401);
  return session;
}

export async function requireRole(...roles: SessionPayload['role'][]): Promise<SessionPayload> {
  const session = await requireSession();
  if (!roles.includes(session.role)) {
    throw new AuthError('Not authorized for this action', 403);
  }
  return session;
}
