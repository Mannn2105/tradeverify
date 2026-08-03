import bcrypt from 'bcryptjs';

// NOTE: bcrypt only works in the Node.js runtime, not the Edge runtime.
// This file must only ever be imported from Route Handlers (Node runtime
// by default), never from proxy.ts (Edge runtime). Keeping bcrypt isolated
// here stops it from ever being pulled into the proxy bundle.
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
