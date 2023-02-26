import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UserPayload } from 'src/types/user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(name: string, password: string): Promise<any> {
    const user = await this.userService.findUser({ name });
    const isValid = await bcrypt.compare(password, user?.password ?? '');

    if (user && isValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload: UserPayload = { name: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(name: string, password: string) {
    const user = await this.userService.findUser({ name });

    if (user) {
      throw new HttpException({ message: '5001:' }, HttpStatus.BAD_REQUEST);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const { password: __, ...newUser } = await this.userService.createUser({
      name,
      password: encryptedPassword,
    });

    return newUser;
  }
}
