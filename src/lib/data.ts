import { connectDB } from './db';
import Provider from '@/models/Provider';
import Service from '@/models/Service';
import Booking from '@/models/Booking';
import Review from '@/models/Review';

// Server-only data access for the marketing page. These are the same queries
// the API routes run, pulled directly so the public pages render live data
// instead of hardcoded demo entries.
export async function getVerifiedProviders(limit = 50) {
  await connectDB();
  return Provider.find({ verificationStatus: 'verified' })
    .sort({ rating: -1, createdAt: 1 })
    .limit(limit);
}

export type RegistryStat = {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
};

export async function getRegistryStats(): Promise<RegistryStat[]> {
  await connectDB();
  const [verified, services, bookings, reviews] = await Promise.all([
    Provider.countDocuments({ verificationStatus: 'verified' }),
    Service.countDocuments({ active: true }),
    Booking.countDocuments(),
    Review.countDocuments(),
  ]);

  return [
    {
      value: verified,
      decimals: 0,
      suffix: '',
      label: 'Verified pros on the books',
    },
    {
      value: services,
      decimals: 0,
      suffix: '',
      label: 'Bookable services listed',
    },
    {
      value: bookings,
      decimals: 0,
      suffix: '',
      label: 'Bookings on the record',
    },
    {
      value: reviews,
      decimals: 0,
      suffix: '',
      label: 'Customer reviews logged',
    },
  ];
}
