import { IUser } from './user.interface';
export interface IPayment extends Document {
  amount: number;
  status: string;
  token: string;
  session_id: string;
  user_id: IUser;
}
