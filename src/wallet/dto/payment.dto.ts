import { IsInt, IsNotEmpty, IsString } from 'class-validator';
export class PaymentDTO {
  @IsInt()
  @IsNotEmpty()
  readonly amount: number;
  @IsString()
  @IsNotEmpty()
  readonly document: string;
}
