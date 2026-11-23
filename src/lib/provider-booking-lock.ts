import type { ClientSession, Types } from 'mongoose';
import Provider from '@/models/Provider';
import { HttpError } from '@/lib/http-error';

/**
 * Writes to the provider document inside the booking transaction.
 * Concurrent booking transactions for one provider therefore contend on the
 * same document; MongoDB aborts/retries one transaction instead of allowing
 * both requests to pass an overlap check against the same snapshot.
 */
export async function lockVerifiedProviderForBooking(
  providerId: string | Types.ObjectId,
  session: ClientSession
) {
  const provider = await Provider.findOneAndUpdate(
    { _id: providerId, verificationStatus: 'verified' },
    { $inc: { bookingLockVersion: 1 } },
    { new: true, session }
  ).select('+bookingLockVersion');

  if (provider) return provider;

  const exists = await Provider.exists({ _id: providerId }).session(session);
  if (!exists) throw new HttpError('Provider not found', 404);
  throw new HttpError(
    'This provider is not yet verified and cannot accept marketplace bookings',
    403
  );
}
