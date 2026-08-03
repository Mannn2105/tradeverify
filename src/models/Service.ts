import mongoose, { Schema, models, model } from 'mongoose';
import { TRADES } from '@/lib/validators';

export interface IService {
  _id: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: (typeof TRADES)[number];
  priceType: 'fixed' | 'hourly' | 'quote';
  price?: number;
  durationMinutes?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, enum: TRADES, required: true },
    priceType: { type: String, enum: ['fixed', 'hourly', 'quote'], required: true },
    price: { type: Number },
    durationMinutes: { type: Number },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ServiceSchema.index({ providerId: 1, active: 1 });

export default models.Service || model<IService>('Service', ServiceSchema);
