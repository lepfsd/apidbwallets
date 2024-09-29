import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { USER, WALLET } from 'src/common/models/models';
import { UserSchema } from './schema/user.schema';
import { WalletSchema } from 'src/wallet/schema/wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: USER.name,
        useFactory: () => {
          return UserSchema;
        },
      },
      {
        name: WALLET.name,
        useFactory: () => {
          return WalletSchema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
