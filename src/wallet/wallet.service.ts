import { HttpStatus, Injectable } from '@nestjs/common';
import { WalletDTO } from './dto/wallet.dto';
import { IWallet } from 'src/common/interfaces/wallet.interface';
import { InjectModel } from '@nestjs/mongoose';
import { PAYMENT, USER, WALLET } from 'src/common/models/models';
import { Model } from 'mongoose';
import { IUser } from 'src/common/interfaces/user.interface';
import { IPayment } from 'src/common/interfaces/payment.interface';
import { PaymentStatus } from 'src/payment-status';
import { PaymentDTO } from './dto/payment.dto';
import { ConfirmPaymentDTO } from './dto/confirm-payment.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(WALLET.name) private readonly model: Model<IWallet>,
    @InjectModel(USER.name) private readonly modelUser: Model<IUser>,
    @InjectModel(PAYMENT.name) private readonly modelPayment: Model<IPayment>,
    private readonly mailService: MailerService,
  ) {}

  async charge(walletDTO: WalletDTO) {
    const user = await this.modelUser.findOne({
      document: walletDTO.document,
      phone: walletDTO.phone,
    });
    if (user) {
      const charge = await this.model.findOne({ user_id: user._id });
      charge.amount = charge.amount + Math.abs(walletDTO.amount);
      await charge.save();
      return {
        status: HttpStatus.OK,
        msg: `charge done for amount ${walletDTO.amount}`,
        data: { amount: charge.amount },
      };
    }
    return { status: HttpStatus.NOT_FOUND, msg: 'wallet not found' };
  }

  async getFunds(document: string, phone: string) {
    const user = await this.modelUser.findOne({
      document: document,
      phone: phone,
    });
    if (user) {
      const wallet = await this.model.findOne({ user_id: user._id });
      return {
        status: HttpStatus.OK,
        msg: `OK`,
        data: { amount: wallet?.amount },
      };
    }
    return { status: HttpStatus.NOT_FOUND, msg: 'wallet not found' };
  }

  async createPayment(paymentDTO: PaymentDTO) {
    const user = await this.modelUser.findOne({
      document: paymentDTO.document,
    });
    if (!user) {
      return { status: HttpStatus.NOT_FOUND, msg: 'user not found' };
    }
    const token = Math.random().toString(36).substring(2, 8);
    const session_id = Math.random().toString(36).substring(2, 10);
    const payment = new this.modelPayment({
      token: token,
      session_id: session_id,
      user_id: user._id,
      amount: Math.abs(paymentDTO.amount),
      status: PaymentStatus.PENDING,
    });
    await payment.save();
    const url = `http://localhost:3001/api/v1/wallet/payment?token=${token}&sessionId=${session_id}`;
    this.mailService.sendMail({
      from: 'jrinjustice777@gmail.com',
      to: user.email,
      subject: `Orden de compra`,
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mi Página</title>
        </head>
        <body>
          <h1>Hola ${user.name},</h1>
          <p>Accede al siguiente enlace para realizar la compra</p>
          <p><strong>$ ${payment.amount}</strong></p>
          <a href="${url}" target="_blank">haz click aqui para pagar</a>
        </body>
      </html>`,
    });
    return {
      status: HttpStatus.OK,
      msg: `OK`,
      data: {
        token: token,
        session_id: session_id,
        amount: payment.amount,
        email: user.email,
      },
    };
  }

  async confirm(cconfirmPaymentDTO: ConfirmPaymentDTO) {
    const payment = await this.modelPayment.findOne({
      token: cconfirmPaymentDTO.token,
      session_id: cconfirmPaymentDTO.session_id,
    });
    if (!payment) {
      return { status: HttpStatus.NOT_FOUND, msg: 'payment not found' };
    }
    const wallet = await this.model.findOne({ user_id: payment.user_id });
    if (wallet.amount >= payment.amount) {
      wallet.amount -= payment.amount;
      await wallet.save();
      payment.status = PaymentStatus.APPROVED;
      await payment.save();
      return {
        status: HttpStatus.OK,
        msg: `paid`,
        data: { payment: payment },
      };
    } else {
      payment.status = PaymentStatus.REJECTED;
      await payment.save();
      return { status: HttpStatus.PRECONDITION_FAILED, msg: 'no founds' };
    }
  }
}
