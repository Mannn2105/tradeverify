import mongoose, { Schema, models, model } from 'mongoose';
import { HttpError } from '@/lib/http-error';

export const BOOKING_STATUS = [
  'requested',
  'confirmed',
  'declined',
  'completed',
  'cancelled',
] as const;

export type BookingStatus = (typeof BOOKING_STATUS)[number];

export type BookingHistoryEntry = {
  status: BookingStatus;
  at: Date;
  by: string;
};

export interface IBooking {
  _id: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  requestedDate: Date;
  durationMinutes?: number;
  address: string;
  notes?: string;
  status: BookingStatus;
  price?: number;
  source: 'marketplace' | 'direct';
  statusHistory: BookingHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// Valid transitions, enforced at the data layer (pre-save hook below) so a
// booking can never jump straight from 'requested' to 'completed', etc.,
// regardless of which route or script writes to it.
export const ALLOWED_TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = {
  requested: ['confirmed', 'declined', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  declined: [],
  cancelled: [],
};

const BookingSchema = new Schema<IBooking>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    requestedDate: { type: Date, required: true },
    durationMinutes: { type: Number, min: 5, max: 480 },
    address: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: BOOKING_STATUS,
      default: 'requested',
    },
    price: { type: Number },
    source: { type: String, enum: ['marketplace', 'direct'], default: 'marketplace' },
    statusHistory: {
      type: [
        {
          status: { type: String, enum: BOOKING_STATUS, required: true },
          at: { type: Date, default: Date.now },
          by: { type: String, default: 'system' },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// The route sets (booking as any)._transitionBy before save() so the audit
// trail records who performed the transition. It is not a schema path and is
// dropped by Mongoose's strict mode, so it is never persisted.
// Mongoose 9 pre-save middleware has no `next` callback — throw to abort.
BookingSchema.pre('save', function () {
  if (this.isModified('status')) {
    const previous =
      this.statusHistory && this.statusHistory.length > 0
        ? this.statusHistory[this.statusHistory.length - 1].status
        : 'requested';

    if (previous !== this.status) {
      const allowed = ALLOWED_TRANSITIONS[previous] ?? [];
      if (!allowed.includes(this.status)) {
        throw new HttpError(
          `Cannot transition booking from '${previous}' to '${this.status}'`,
          422
        );
      }
      this.statusHistory.push({
        status: this.status,
        at: new Date(),
        by: (this as IBooking & { _transitionBy?: string })._transitionBy ?? 'system',
      });
    }
  }
});

BookingSchema.index({ providerId: 1, status: 1, requestedDate: 1 });
BookingSchema.index({ customerId: 1, status: 1 });

export default models.Booking || model<IBooking>('Booking', BookingSchema);
