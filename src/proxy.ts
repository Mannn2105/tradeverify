import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

// Public GET browsing paths — read-only marketplace surfaces.
function isPublicGet(pathname: string): boolean {
  if (pathname === '/api/search') return true;
  if (pathname === '/api/services' || pathname.startsWith('/api/services/')) return true;
  if (pathname === '/api/availability' || pathname.startsWith('/api/availability/')) return true;
  if (pathname === '/api/reviews' || pathname.startsWith('/api/reviews/')) return true;
  // Provider profile browsing: the list and the single-id profile only.
  // Nested paths like /api/providers/:id/verification stay protected.
  if (pathname === '/api/providers') return true;
  if (/^\/api\/providers\/[^/]+$/.test(pathname)) return true;
  return false;
}

// Account creation / session endpoints — always reachable.
function isPublicAuth(method: string, pathname: string): boolean {
  return method === 'POST' && pathname.startsWith('/api/auth/');
}

// Routes that require *some* logged-in user. Fine-grained role checks
// (e.g. "must be a provider", "must be admin") still happen inside each
// route handler via requireRole() — this proxy just blocks completely
// anonymous access early, before hitting the database.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  if (method === 'OPTIONS') return NextResponse.next();
  if (isPublicGet(pathname)) return NextResponse.next();
  if (isPublicAuth(method, pathname)) return NextResponse.next();

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
