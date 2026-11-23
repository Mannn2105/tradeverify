import { NextRequest } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { connectDB } from '@/lib/db';
import Booking from '@/models/Booking';
import Provider from '@/models/Provider';
import Review from '@/models/Review';
import { reviewSchema } from '@/lib/validators';
import { requireRole, AuthError } from '@/lib/auth';
import { handleRoute, created, ok, fail } from '@/lib/apiResponse';

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const session = await requireRole('customer');
    const input = reviewSchema.parse(await req.json());
    if (!isValidObjectId(input.bookingId)) return fail('Booking not found', 404);

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

    return created(review);
  });
}

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get('providerId');
    if (!providerId || !isValidObjectId(providerId)) {
      return fail('A valid providerId query param is required', 400);
    }

    const provider = await Provider.findOne({
      _id: providerId,
      verificationStatus: 'verified',
    }).select('_id');
    if (!provider) return fail('Provider not found', 404);

    const reviews = await Review.find({ providerId: provider._id })
      .select('rating comment createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return ok(reviews);
  });
}
