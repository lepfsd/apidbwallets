import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PAYMENT, USER, WALLET } from 'src/common/models/models';
import { WalletSchema } from './schema/wallet.schema';
import { PaymentSchema } from './schema/payment.schema';
import { UserSchema } from 'src/user/schema/user.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: WALLET.name,
        useFactory: () => {
          return WalletSchema;
        },
      },
      {
        name: USER.name,
        useFactory: () => {
          return UserSchema;
        },
      },
      {
        name: PAYMENT.name,
        useFactory: () => {
          return PaymentSchema;
        },
      },
    ]),
    UserModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
