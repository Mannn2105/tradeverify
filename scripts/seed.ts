/**
 * Run with: npm run seed
 * Populates a fresh database with an admin user, one verified provider (with
 * an approved verification record, service, and weekly availability), and a
 * demo customer — enough to test the marketplace search + booking flow
 * immediately after cloning.
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';
import Provider from '../src/models/Provider';
import Verification from '../src/models/Verification';
import Service from '../src/models/Service';
import Availability from '../src/models/Availability';
import Booking from '../src/models/Booking';
import Review from '../src/models/Review';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI');

  await mongoose.connect(uri);
  console.log('Connected to MongoDB. Seeding...');

  await Promise.all([
    User.deleteMany({}),
    Provider.deleteMany({}),
    Verification.deleteMany({}),
    Service.deleteMany({}),
    Availability.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Platform Admin',
    email: 'admin@localpro.dev',
    passwordHash: await bcrypt.hash('AdminPass123!', 12),
    role: 'admin',
  });

  const providerUser = await User.create({
    name: 'Jordan Ruiz',
    email: 'provider@localpro.dev',
    passwordHash: await bcrypt.hash('ProviderPass123!', 12),
    role: 'provider',
    phone: '+15125550142',
  });

  const provider = await Provider.create({
    userId: providerUser._id,
    businessName: 'Ruiz Electrical Co.',
    trade: 'electrician',
    bio: 'Licensed residential & commercial electrician, 12 years in Austin.',
    yearsInBusiness: 12,
    serviceArea: { type: 'Point', coordinates: [-97.7431, 30.2672] }, // Austin, TX
    radiusKm: 40,
    verificationStatus: 'verified',
    verifiedAt: new Date(),
  });

  await Verification.create({
    providerId: provider._id,
    type: 'license',
    documentUrl: 'https://example.com/docs/ruiz-electrician-license.pdf',
    status: 'verified',
    reviewedBy: admin._id,
    reviewedAt: new Date(),
    notes: 'Master electrician license TX-48291 verified.',
  });

  const service = await Service.create({
    providerId: provider._id,
    title: 'Panel Inspection & Safety Check',
    description: 'Full electrical panel inspection with a same-week appointment.',
    category: 'electrician',
    priceType: 'fixed',
    price: 129,
    durationMinutes: 60,
  });

  await Availability.create([
    { providerId: provider._id, dayOfWeek: 1, startTime: '08:00', endTime: '12:00' },
    { providerId: provider._id, dayOfWeek: 1, startTime: '13:00', endTime: '17:00' },
    { providerId: provider._id, dayOfWeek: 3, startTime: '08:00', endTime: '12:00' },
    { providerId: provider._id, dayOfWeek: 5, startTime: '08:00', endTime: '17:00' },
  ]);

  await User.create({
    name: 'Maya Chen',
    email: 'customer@localpro.dev',
    passwordHash: await bcrypt.hash('CustomerPass123!', 12),
    role: 'customer',
    phone: '+15125550199',
  });

  console.log('Seed complete:');
  console.log(`  Admin login:    admin@localpro.dev / AdminPass123!`);
  console.log(`  Provider login: provider@localpro.dev / ProviderPass123!`);
  console.log(`  Customer login: customer@localpro.dev / CustomerPass123!`);
  console.log(`  Provider id:    ${provider._id}`);
  console.log(`  Service id:     ${service._id}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
