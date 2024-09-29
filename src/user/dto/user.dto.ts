import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  readonly document: string;
  @IsString()
  @IsNotEmpty()
  readonly phone: string;
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
