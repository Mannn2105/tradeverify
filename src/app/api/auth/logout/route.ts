import { clearSessionCookie } from '@/lib/auth';
import { handleRoute, ok } from '@/lib/apiResponse';

export async function POST() {
  return handleRoute(async () => {
    await clearSessionCookie();
    return ok({ loggedOut: true });
  });
}
