import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Provider from '@/models/Provider';
import Service from '@/models/Service';
import Booking from '@/models/Booking';
import { bookingCreateSchema } from '@/lib/validators';
import { requireRole, requireSession } from '@/lib/auth';
import { handleRoute, created, ok, fail } from '@/lib/apiResponse';

// Customers request a booking with a verified provider for one of their services.
export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const session = await requireRole('customer');
    const input = bookingCreateSchema.parse(await req.json());

    await connectDB();

    const provider = await Provider.findById(input.providerId);
    if (!provider) return fail('Provider not found', 404);
    if (provider.verificationStatus !== 'verified') {
      return fail('This provider is not yet verified and cannot accept marketplace bookings', 403);
    }

    const service = await Service.findOne({
      _id: input.serviceId,
      providerId: provider._id,
      active: true,
    });
    if (!service) return fail('Service not found for this provider', 404);

    const booking = await Booking.create({
      customerId: session.userId,
      providerId: provider._id,
      serviceId: service._id,
      requestedDate: new Date(input.requestedDate),
      address: input.address,
      notes: input.notes,
      price: service.priceType === 'fixed' ? service.price : undefined,
      status: 'requested',
      source: 'marketplace',
    });

    return created(booking);
  });
}

// Returns bookings relevant to the current user: as a customer, their own
// requests; as a provider, bookings made against their provider profile;
// as an admin, everything.
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
