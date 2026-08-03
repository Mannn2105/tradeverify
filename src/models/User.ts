import mongoose, { Schema, models, model } from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'provider' | 'admin';
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['customer', 'provider', 'admin'], required: true, default: 'customer' },
    phone: { type: String },
  },
  { timestamps: true }
);

export default models.User || model<IUser>('User', UserSchema);
