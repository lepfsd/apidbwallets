import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    const isValidPassword = await this.userService.checkPassword(
      password,
      user.password,
    );

    if (user && isValidPassword) return user;

    return null;
  }

  async signIn(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
    };
    const userAuth = await this.userService.findByEmail(user.email);

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        name: userAuth.name,
        document: userAuth.document,
        email: userAuth.email,
        phone: userAuth.phone,
      },
    };
  }

  async signUp(userDTO: UserDTO) {
    return this.userService.create(userDTO);
  }
}
