import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Booking from '@/models/Booking';
import Review from '@/models/Review';
import { reviewSchema } from '@/lib/validators';
import { requireRole, AuthError } from '@/lib/auth';
import { handleRoute, created, ok, fail } from '@/lib/apiResponse';

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const session = await requireRole('customer');
    const input = reviewSchema.parse(await req.json());

    await connectDB();

    const booking = await Booking.findById(input.bookingId);
    if (!booking) return fail('Booking not found', 404);
    if (booking.customerId.toString() !== session.userId) {
      throw new AuthError('You can only review your own bookings', 403);
    }
    if (booking.status !== 'completed') {
      return fail('You can only review a completed booking', 422);
    }

    const existing = await Review.findOne({ bookingId: booking._id });
    if (existing) return fail('This booking has already been reviewed', 409);

    const review = await Review.create({
      bookingId: booking._id,
      customerId: session.userId,
      providerId: booking.providerId,
      rating: input.rating,
      comment: input.comment,
    });

    // The Review model's post-save hook recalculates the provider's aggregate
    // rating and review count on this write.
    return created(review);
  });
}

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get('providerId');
    if (!providerId) return fail('providerId query param is required', 400);

    const reviews = await Review.find({ providerId }).sort({ createdAt: -1 });
    return ok(reviews);
  });
}
