import { Injectable } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { USER, WALLET } from 'src/common/models/models';
import { Model } from 'mongoose';
import { IWallet } from 'src/common/interfaces/wallet.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER.name) private readonly model: Model<IUser>,
    @InjectModel(WALLET.name) private readonly modelWallet: Model<IWallet>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  async create(userDTO: UserDTO): Promise<IUser> {
    const hash = await this.hashPassword(userDTO.password);
    const newUser = new this.model({ ...userDTO, password: hash });
    await newUser.save();
    const wallet = new this.modelWallet({ amount: 0, user_id: newUser._id });
    await wallet.save();
    return newUser;
  }

  async findByEmail(email: string): Promise<IUser> {
    return await this.model.findOne({ email: email });
  }

  async checkPassword(password: string, passwordDB: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordDB);
  }
}
