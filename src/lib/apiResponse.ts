import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { HttpError } from './http-error';

export function ok(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created(data: unknown) {
  return ok(data, 201);
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}

// Wrap a route handler body in this to get consistent error responses
// for validation errors, auth errors, and unexpected exceptions.
export async function handleRoute(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof HttpError) {
      return fail(err.message, err.status);
    }
    if (err instanceof ZodError) {
      return fail('Validation failed', 422, err.flatten());
    }
    console.error('Unhandled API error:', err);
    return fail('Internal server error', 500);
  }
}
