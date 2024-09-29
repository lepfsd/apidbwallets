export interface IUser extends Document {
  name: string;
  document: string;
  email: string;
  phone: string;
  password: string;
}
