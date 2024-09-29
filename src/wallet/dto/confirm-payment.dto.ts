import { IsNotEmpty, IsString } from 'class-validator';
export class ConfirmPaymentDTO {
  @IsString()
  readonly token: string;
  @IsString()
  @IsNotEmpty()
  readonly session_id: string;
}
