import * as mongoose from 'mongoose';

export const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  token: { type: String, required: true },
  session_id: { type: String, required: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
});
