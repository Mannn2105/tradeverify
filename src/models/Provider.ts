import mongoose, { Schema, models, model } from 'mongoose';
import { TRADES } from '@/lib/validators';

export interface IProvider {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  businessName: string;
  trade: (typeof TRADES)[number];
  bio?: string;
  yearsInBusiness?: number;
  // GeoJSON point — required for $nearSphere / $geoWithin marketplace search
  serviceArea: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  radiusKm: number;
  timeZone: string;
  // This is the core trust gate: only 'verified' providers are ever
  // returned by the public marketplace search endpoint.
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  verifiedAt?: Date;
  rating: number;
  reviewCount: number;
  // Incremented inside booking transactions to serialize requests per provider.
  bookingLockVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderSchema = new Schema<IProvider>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    trade: { type: String, enum: TRADES, required: true },
    bio: { type: String },
    yearsInBusiness: { type: Number },
    serviceArea: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: { type: [Number], required: true },
    },
    radiusKm: { type: Number, required: true },
    timeZone: { type: String, required: true, default: 'UTC' },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified',
    },
    verifiedAt: { type: Date },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    bookingLockVersion: { type: Number, default: 0, select: false },
  },
  { timestamps: true }
);

ProviderSchema.index({ serviceArea: '2dsphere' });
ProviderSchema.index({ trade: 1, verificationStatus: 1 });

export default models.Provider || model<IProvider>('Provider', ProviderSchema);
