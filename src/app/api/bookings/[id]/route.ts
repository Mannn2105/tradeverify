import { NextRequest } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import Booking from '@/models/Booking';
import { bookingUpdateSchema } from '@/lib/validators';
import { requireSession, AuthError } from '@/lib/auth';
import { handleRoute, ok, fail } from '@/lib/apiResponse';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const session = await requireSession();
    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail('Booking not found', 404);
    const booking = await Booking.findById(id);
    if (!booking) return fail('Booking not found', 404);

    const provider = await Provider.findById(booking.providerId);
    const isCustomer = booking.customerId.toString() === session.userId;
    const isProvider = provider?.userId.toString() === session.userId;
    if (!isCustomer && !isProvider && session.role !== 'admin') {
      throw new AuthError('Not authorized to view this booking', 403);
    }

    return ok(booking);
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const session = await requireSession();
    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail('Booking not found', 404);
    const booking = await Booking.findById(id);
    if (!booking) return fail('Booking not found', 404);

    const provider = await Provider.findById(booking.providerId);
    const isCustomer = booking.customerId.toString() === session.userId;
    const isProvider = provider?.userId.toString() === session.userId;
    if (!isCustomer && !isProvider && session.role !== 'admin') {
      throw new AuthError('Not authorized to update this booking', 403);
    }

    const { status } = bookingUpdateSchema.parse(await req.json());

    // Only the provider (or an admin) can confirm/decline/complete; either
    // party can cancel. The model enforces allowed state transitions.
    if (
      (status === 'confirmed' || status === 'declined' || status === 'completed') &&
      !isProvider &&
      session.role !== 'admin'
    ) {
      throw new AuthError('Only the provider can confirm, decline, or complete a booking', 403);
    }

    (booking as unknown as { _transitionBy: string })._transitionBy = session.userId;
    booking.status = status;
    await booking.save();
    return ok(booking);
  });
}
