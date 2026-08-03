import mongoose, { Schema, models, model } from 'mongoose';

export interface IVerification {
  _id: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  type: 'license' | 'insurance' | 'background_check';
  documentUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new Schema<IVerification>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
    type: { type: String, enum: ['license', 'insurance', 'background_check'], required: true },
    documentUrl: { type: String, required: true },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    notes: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

VerificationSchema.index({ providerId: 1, status: 1 });

export default models.Verification || model<IVerification>('Verification', VerificationSchema);
