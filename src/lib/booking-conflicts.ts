export type BookingInterval = {
  requestedDate: Date;
  durationMinutes?: number;
};

const MINUTE_MS = 60_000;

/**
 * Treats appointments as half-open intervals [start, end). Legacy bookings
 * without a duration remain point reservations: they conflict with another
 * point at the same instant or when they fall inside a timed appointment.
 */
export function bookingIntervalsOverlap(a: BookingInterval, b: BookingInterval): boolean {
  const aStart = a.requestedDate.getTime();
  const bStart = b.requestedDate.getTime();
  const aDuration = a.durationMinutes ?? 0;
  const bDuration = b.durationMinutes ?? 0;
  const aEnd = aStart + aDuration * MINUTE_MS;
  const bEnd = bStart + bDuration * MINUTE_MS;

  if (aDuration === 0 && bDuration === 0) return aStart === bStart;
  if (aDuration === 0) return aStart >= bStart && aStart < bEnd;
  if (bDuration === 0) return bStart >= aStart && bStart < aEnd;

  return aStart < bEnd && bStart < aEnd;
}
