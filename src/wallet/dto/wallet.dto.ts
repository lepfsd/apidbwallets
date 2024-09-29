import { IsInt, IsString, IsNotEmpty } from 'class-validator';
export class WalletDTO {
  @IsInt()
  @IsNotEmpty()
  readonly amount: number;
  @IsString()
  @IsNotEmpty()
  readonly document: string;
  @IsString()
  @IsNotEmpty()
  readonly phone: string;
}
