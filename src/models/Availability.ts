import mongoose, { Schema, models, model } from 'mongoose';

export interface IAvailability {
  _id: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  dayOfWeek: number; // 0 = Sunday .. 6 = Saturday
  startTime: string; // "HH:MM" 24h
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const AvailabilitySchema = new Schema<IAvailability>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { timestamps: true }
);

AvailabilitySchema.index({ providerId: 1, dayOfWeek: 1 });

export default models.Availability || model<IAvailability>('Availability', AvailabilitySchema);
