/**
 * Run with: npm run verify
 * Spins up an in-memory MongoDB and exercises the data-layer guarantees:
 *   - marketplace search only surfaces 'verified' providers (incl. geo)
 *   - booking status transitions are enforced at the model layer with audit
 *   - provider rating/reviewCount are recalculated on every review write
 *   - one review per booking (unique index backstop)
 */
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { connectDB } from '../src/lib/db';
import User from '../src/models/User';
import Provider from '../src/models/Provider';
import Service from '../src/models/Service';
import Booking from '../src/models/Booking';
import Review from '../src/models/Review';
import { HttpError } from '../src/lib/http-error';
import { lockVerifiedProviderForBooking } from '../src/lib/provider-booking-lock';

let pass = 0;
let fail = 0;

import { bookingIntervalsOverlap } from '../src/lib/booking-conflicts';

const interval = (start: string, durationMinutes?: number) => ({
  requestedDate: new Date(start),
  durationMinutes,
});

console.log('\nBooking interval conflict rules:');
assert(
  bookingIntervalsOverlap(interval('2026-12-01T10:00:00Z', 60), interval('2026-12-01T10:30:00Z', 30)),
  'overlapping timed bookings are rejected'
);
assert(
  !bookingIntervalsOverlap(interval('2026-12-01T10:00:00Z', 30), interval('2026-12-01T10:30:00Z', 30)),
  'back-to-back appointments are allowed'
);
assert(
  bookingIntervalsOverlap(interval('2026-12-01T10:15:00Z'), interval('2026-12-01T10:00:00Z', 30)),
  'legacy point booking inside a timed booking conflicts'
);
assert(
  bookingIntervalsOverlap(interval('2026-12-01T10:00:00Z', 30), interval('2026-12-01T10:15:00Z')),
  'timed booking containing a legacy point booking conflicts'
);
assert(
  !bookingIntervalsOverlap(interval('2026-12-01T10:30:00Z'), interval('2026-12-01T10:00:00Z', 30)),
  'legacy point booking at an appointment end is allowed'
);
assert(
  bookingIntervalsOverlap(interval('2026-12-01T10:00:00Z'), interval('2026-12-01T10:00:00Z')),
  'legacy point bookings at the same instant conflict'
);



function assert(cond: boolean, name: string) {
  if (cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name}`);
  }
}

async function main() {
  const mongod = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  process.env.MONGODB_URI = mongod.getUri();

  await connectDB();
  await Provider.init();

  const providerUser = await User.create({
    name: 'Verified Provider',
    email: 'provider@verify.dev',
    passwordHash: 'x',
    role: 'provider',
  });
  const unverifiedUser = await User.create({
    name: 'Unverified Provider',
    email: 'unverified@verify.dev',
    passwordHash: 'x',
    role: 'provider',
  });
  const customerUser = await User.create({
    name: 'Customer',
    email: 'customer@verify.dev',
    passwordHash: 'x',
    role: 'customer',
  });

  const verified = await Provider.create({
    userId: providerUser._id,
    businessName: 'Verified Electric Co.',
    trade: 'electrician',
    serviceArea: { type: 'Point', coordinates: [-97.7431, 30.2672] }, // Austin, TX
    radiusKm: 40,
    verificationStatus: 'verified',
  });
  console.log('\\nConcurrent booking transaction lock:');
  const lockVersions = await Promise.all(
    [1, 2].map(async () => {
      const session = await mongoose.startSession();
      try {
        return await session.withTransaction(async () => {
          const lockedProvider = await lockVerifiedProviderForBooking(verified._id, session);
          // Keep both transactions in flight long enough to exercise write contention.
          await new Promise((resolve) => setTimeout(resolve, 40));
          return lockedProvider.bookingLockVersion;
        });
      } finally {
        await session.endSession();
      }
    })
  );
  const sortedLockVersions = lockVersions.slice().sort((a, b) => a - b);
  assert(
    sortedLockVersions[0] === 1 && sortedLockVersions[1] === 2,
    'concurrent transactions serialize on the provider booking lock'
  );

  await Provider.create({
    userId: unverifiedUser._id,
    businessName: 'Pending Plumber Co.',
    trade: 'plumber',
    serviceArea: { type: 'Point', coordinates: [-97.7431, 30.2672] },
    radiusKm: 40,
    verificationStatus: 'pending',
  });

  const service = await Service.create({
    providerId: verified._id,
    title: 'Panel Inspection',
    category: 'electrician',
    priceType: 'fixed',
    price: 129,
  });

  console.log('\nMarketplace gate (verified-only):');
  const listed = await Provider.find({ verificationStatus: 'verified' });
  assert(listed.length === 1 && listed[0]._id.equals(verified._id), 'listing returns only the verified provider');

  const geo = await Provider.find({
    verificationStatus: 'verified',
    serviceArea: {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [-97.7431, 30.2672] },
        $maxDistance: 40000,
      },
    },
  });
  assert(geo.length === 1, 'geo $nearSphere search finds the verified provider');

  console.log('\nBooking transitions (data layer):');
  const booking = await Booking.create({
    customerId: customerUser._id,
    providerId: verified._id,
    serviceId: service._id,
    requestedDate: new Date('2026-08-10T12:00:00Z'),
    durationMinutes: 60,
    address: '123 Main St, Austin TX',
    status: 'requested',
    source: 'marketplace',
  });
  assert(booking.status === 'requested', 'booking starts as requested');
  assert(booking.durationMinutes === 60, 'booking stores a snapshot of service duration');

  booking.status = 'completed';
  let threw = false;
  try {
    await booking.save();
  } catch (err) {
    threw = err instanceof HttpError && /Cannot transition/.test((err as Error).message);
  }
  assert(threw, 'requested -> completed is rejected by the model hook');

  booking.status = 'confirmed';
  (booking as unknown as { _transitionBy: string })._transitionBy = providerUser._id.toString();
  await booking.save();
  assert(
    booking.status === 'confirmed' && booking.statusHistory.length === 1,
    'requested -> confirmed allowed and recorded in statusHistory'
  );

  booking.status = 'completed';
  (booking as unknown as { _transitionBy: string })._transitionBy = providerUser._id.toString();
  await booking.save();
  assert(
    booking.status === 'completed' && booking.statusHistory.length === 2,
    'confirmed -> completed allowed and recorded in statusHistory'
  );

  console.log('\nRating recalc (data layer):');
  await Review.create({
    bookingId: booking._id,
    customerId: customerUser._id,
    providerId: verified._id,
    rating: 5,
  });
  let prov = await Provider.findById(verified._id);
  assert(prov?.rating === 5 && prov?.reviewCount === 1, 'provider rating 5.0 after one 5-star review');

  const booking2 = await Booking.create({
    customerId: customerUser._id,
    providerId: verified._id,
    serviceId: service._id,
    requestedDate: new Date('2026-08-11T12:00:00Z'),
    address: '456 Oak St, Austin TX',
    status: 'requested',
    source: 'marketplace',
  });
  booking2.status = 'confirmed';
  (booking2 as unknown as { _transitionBy: string })._transitionBy = providerUser._id.toString();
  await booking2.save();
  booking2.status = 'completed';
  (booking2 as unknown as { _transitionBy: string })._transitionBy = providerUser._id.toString();
  await booking2.save();

  await Review.create({
    bookingId: booking2._id,
    customerId: customerUser._id,
    providerId: verified._id,
    rating: 3,
  });
  prov = await Provider.findById(verified._id);
  assert(prov?.rating === 4 && prov?.reviewCount === 2, 'provider rating aggregates to 4.0 across reviews');

  let dupThrew = false;
  try {
    await Review.create({
      bookingId: booking._id,
      customerId: customerUser._id,
      providerId: verified._id,
      rating: 1,
    });
  } catch {
    dupThrew = true;
  }
  assert(dupThrew, 'duplicate review for a booking is blocked by the unique index');

  await mongod.stop();

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
