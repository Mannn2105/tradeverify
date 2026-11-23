import { connectDB } from './db';
import Provider from '@/models/Provider';
import Service from '@/models/Service';
import Booking from '@/models/Booking';
import Review from '@/models/Review';

// Server-only data access for the marketing page. The public landing page
// should remain renderable even when the optional database is not configured
// yet or is temporarily unavailable (for example, on a fresh preview deploy).
// In that case, render empty registry data rather than crashing the page.
export async function getVerifiedProviders(limit = 50) {
  try {
    await connectDB();
    return await Provider.find({ verificationStatus: 'verified' })
      .sort({ rating: -1, createdAt: 1 })
      .limit(limit);
  } catch (error) {
    console.error('Unable to load verified providers for the public page:', error);
    return [];
  }
}

export type RegistryStat = {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
};

export async function getRegistryStats(): Promise<RegistryStat[]> {
  const emptyStats: RegistryStat[] = [
    { value: 0, decimals: 0, suffix: '', label: 'Verified pros on the books' },
    { value: 0, decimals: 0, suffix: '', label: 'Bookable services listed' },
    { value: 0, decimals: 0, suffix: '', label: 'Bookings on the record' },
    { value: 0, decimals: 0, suffix: '', label: 'Customer reviews logged' },
  ];

  try {
    await connectDB();
    const [verified, services, bookings, reviews] = await Promise.all([
      Provider.countDocuments({ verificationStatus: 'verified' }),
      Service.countDocuments({ active: true }),
      Booking.countDocuments(),
      Review.countDocuments(),
    ]);

    return [
      { value: verified, decimals: 0, suffix: '', label: 'Verified pros on the books' },
      { value: services, decimals: 0, suffix: '', label: 'Bookable services listed' },
      { value: bookings, decimals: 0, suffix: '', label: 'Bookings on the record' },
      { value: reviews, decimals: 0, suffix: '', label: 'Customer reviews logged' },
    ];
  } catch (error) {
    console.error('Unable to load registry statistics for the public page:', error);
    return emptyStats;
  }
}
