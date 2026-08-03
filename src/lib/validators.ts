import { z } from 'zod';

export const TRADES = [
  'electrician',
  'plumber',
  'hvac',
  'mobile_groomer',
  'handyman',
  'landscaper',
  'cleaner',
  'other',
] as const;

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(['customer', 'provider']),
  phone: z.string().min(7).max(20).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const providerProfileSchema = z.object({
  businessName: z.string().min(2).max(150),
  trade: z.enum(TRADES),
  bio: z.string().max(2000).optional(),
  yearsInBusiness: z.number().int().min(0).max(100).optional(),
  serviceArea: z.object({
    lng: z.number(),
    lat: z.number(),
    radiusKm: z.number().min(1).max(200),
  }),
});

export const verificationSubmitSchema = z.object({
  type: z.enum(['license', 'insurance', 'background_check']),
  documentUrl: z.string().url(),
  notes: z.string().max(1000).optional(),
});

export const verificationReviewSchema = z.object({
  status: z.enum(['verified', 'rejected']),
  notes: z.string().max(1000).optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(2).max(150),
  description: z.string().max(2000).optional(),
  category: z.enum(TRADES),
  priceType: z.enum(['fixed', 'hourly', 'quote']),
  price: z.number().min(0).optional(),
  durationMinutes: z.number().int().min(5).max(480).optional(),
});

export const availabilitySlotSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6), // 0 = Sunday
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), // "HH:MM"
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
});

export const bookingCreateSchema = z.object({
  providerId: z.string().min(1),
  serviceId: z.string().min(1),
  requestedDate: z.string().datetime(),
  address: z.string().min(3).max(300),
  notes: z.string().max(1000).optional(),
});

export const bookingUpdateSchema = z.object({
  status: z.enum(['confirmed', 'declined', 'completed', 'cancelled']),
});

export const reviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const searchSchema = z.object({
  trade: z.enum(TRADES).optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radiusKm: z.coerce.number().min(1).max(200).optional().default(25),
  minRating: z.coerce.number().min(0).max(5).optional(),
});
