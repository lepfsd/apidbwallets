import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/user/dto/user.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() req: any) {
    return await this.authService.signIn(req);
  }

  @Post('signup')
  async signUp(@Body() userDTO: UserDTO) {
    return await this.authService.signUp(userDTO);
  }
}
