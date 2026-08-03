import mongoose, { Schema, models, model } from 'mongoose';
import Provider from './Provider';

export interface IReview {
  _id: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

// Recalculate the provider's aggregate rating on every review write — done at
// the data layer so the Provider aggregate stays correct no matter which code
// path creates a review.
ReviewSchema.post('save', async function () {
  const stats = await this.model('Review').aggregate<{
    _id: mongoose.Types.ObjectId;
    avgRating: number;
    count: number;
  }>([
    { $match: { providerId: this.providerId } },
    { $group: { _id: '$providerId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Provider.findByIdAndUpdate(this.providerId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }
});

ReviewSchema.index({ providerId: 1 });

export default models.Review || model<IReview>('Review', ReviewSchema);
