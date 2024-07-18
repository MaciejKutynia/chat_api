import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

import { CreateAccountDto } from '../../accounts/dto/create_account.dto';
import { AccountService } from '../../accounts/services/account.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async registerAccount(data: CreateAccountDto) {
    return this.accountService.createAccount(data);
  }

  async login(data: CreateAccountDto) {
    const account = await this.accountService.validateUser(data);
    if (!account)
      throw new UnauthorizedException('Dane logowania są nie poprawne');
    const payload = {
      id: account.id,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  async verifyToken(token: string) {
    try {
      const decodedPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const { id } = decodedPayload;

      const account = await this.accountService.findOne(id);
      if (!account) throw new UnauthorizedException('Invalid token');
      return token;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
