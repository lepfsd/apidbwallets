import * as mongoose from 'mongoose';

export const WalletSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
});
