import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    document: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

UserSchema.index({ document: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
