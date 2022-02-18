import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginService } from '../login/login.service';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private loginService: LoginService,
    private jwtService: JwtService,
  ) {}

  async validation(
    username: string,
    pass: string,
    isLogin = true,
  ): Promise<any> {
    const user = await this.loginService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      await this.loginService.updateUser(user.id, isLogin);
      return result;
    } else {
      throw new BadRequestException(
        'Please check your username or password again!',
      );
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
