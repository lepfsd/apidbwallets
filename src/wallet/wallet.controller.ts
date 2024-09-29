import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { WalletDTO } from './dto/wallet.dto';
import { PaymentDTO } from './dto/payment.dto';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ConfirmPaymentDTO } from './dto/confirm-payment.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('/charge')
  charge(@Body() walletDTO: WalletDTO) {
    return this.walletService.charge(walletDTO);
  }

  @Get('/funds/:document/:phone')
  getFounds(
    @Param('document') document: string,
    @Param('phone') phone: string,
  ) {
    return this.walletService.getFunds(document, phone);
  }

  @Post('/payment')
  payment(@Body() paymentDTO: PaymentDTO) {
    const payment = this.walletService.createPayment(paymentDTO);
    return payment;
  }

  @Put('/payment')
  confirm(@Body() confirmPaymentDTO: ConfirmPaymentDTO) {
    return this.walletService.confirm(confirmPaymentDTO);
  }
}
