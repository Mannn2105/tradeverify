import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import Service from '@/models/Service';
import Booking from '@/models/Booking';
import { bookingIntervalsOverlap } from '@/lib/booking-conflicts';
import { lockVerifiedProviderForBooking } from '@/lib/provider-booking-lock';
import { HttpError } from '@/lib/http-error';
import { bookingCreateSchema } from '@/lib/validators';
import { requireRole, requireSession } from '@/lib/auth';
import { handleRoute, created, ok, fail } from '@/lib/apiResponse';

// Customers request a booking with a verified provider for one of their services.
export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const session = await requireRole('customer');
    const input = bookingCreateSchema.parse(await req.json());

    if (!isValidObjectId(input.providerId) || !isValidObjectId(input.serviceId)) {
      return fail('Invalid provider or service', 400);
    }

    const requestedDate = new Date(input.requestedDate);
    if (!Number.isFinite(requestedDate.getTime()) || requestedDate.getTime() <= Date.now()) {
      return fail('Booking date must be in the future', 422);
    }

    await connectDB();

    // MongoDB transactions require a replica set (MongoDB Atlas supports this).
    // Updating the provider document inside the transaction serializes booking
    // attempts for that provider. A concurrent transaction gets a write conflict
    // and is retried against the newly committed booking state.
    const dbSession = await mongoose.startSession();
    let booking: Awaited<ReturnType<typeof Booking.create>>[number] | undefined;

    try {
      await dbSession.withTransaction(async () => {
        const provider = await lockVerifiedProviderForBooking(input.providerId, dbSession);

        const service = await Service.findOne({
          _id: input.serviceId,
          providerId: provider._id,
          active: true,
        }).session(dbSession);
        if (!service) throw new HttpError('Service not found for this provider', 404);

        // Snapshot duration and price so later service edits do not rewrite an
        // appointment that has already been requested.
        const durationMinutes = service.durationMinutes;
        const requestedEnd = requestedDate.getTime() + (durationMinutes ?? 0) * 60_000;

        const existingBookings = await Booking.find({
          providerId: provider._id,
          status: { $in: ['requested', 'confirmed'] },
          requestedDate: { $lte: new Date(requestedEnd) },
        })
          .select('requestedDate durationMinutes')
          .session(dbSession);

        const hasConflict = existingBookings.some((existing) =>
          bookingIntervalsOverlap(
            { requestedDate, durationMinutes },
            {
              requestedDate: existing.requestedDate,
              durationMinutes: existing.durationMinutes,
            }
          )
        );

        if (hasConflict) {
          throw new HttpError('This provider already has a booking that overlaps this time', 409);
        }

        const [createdBooking] = await Booking.create(
          [
            {
              customerId: session.userId,
              providerId: provider._id,
              serviceId: service._id,
              requestedDate,
              durationMinutes,
              address: input.address,
              notes: input.notes,
              price: service.priceType === 'fixed' ? service.price : undefined,
              status: 'requested',
              source: 'marketplace',
            },
          ],
          { session: dbSession }
        );

        booking = createdBooking;
      });
    } finally {
      await dbSession.endSession();
    }

    if (!booking) throw new Error('Booking transaction completed without creating a booking');

    return created(booking);
  });
}

// Returns bookings relevant to the current user.
export async function GET() {
  return handleRoute(async () => {
    const session = await requireSession();
    await connectDB();

    if (session.role === 'admin') {
      const bookings = await Booking.find().sort({ requestedDate: -1 });
      return ok(bookings);
    }

    if (session.role === 'provider') {
      const provider = await Provider.findOne({ userId: session.userId });
      if (!provider) return ok([]);
      const bookings = await Booking.find({ providerId: provider._id }).sort({ requestedDate: -1 });
      return ok(bookings);
    }

    const bookings = await Booking.find({ customerId: session.userId }).sort({ requestedDate: -1 });
    return ok(bookings);
  });
}
