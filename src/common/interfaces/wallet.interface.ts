import { IUser } from './user.interface';
export interface IWallet extends Document {
  amount: number;
  user_id: IUser;
}
