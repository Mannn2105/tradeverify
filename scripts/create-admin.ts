/**
 * Run with: npm run create-admin
 * Promotes (or creates) a single user to role 'admin' using real input from
 * the environment — no hardcoded accounts. Requires ADMIN_EMAIL and
 * ADMIN_PASSWORD to be set in .env.local (or the shell).
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI');

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('Missing ADMIN_EMAIL and/or ADMIN_PASSWORD (set them in .env.local)');
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  const existing = await User.findOne({ email: email.toLowerCase() });

  if (existing) {
    existing.role = 'admin';
    if (password) existing.passwordHash = await bcrypt.hash(password, 12);
    await existing.save();
    console.log(`Promoted existing user ${email} to admin.`);
  } else {
    await User.create({
      name: email.split('@')[0],
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
      role: 'admin',
    });
    console.log(`Created admin ${email}.`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
