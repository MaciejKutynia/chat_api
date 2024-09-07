import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

import { CreateAccountDto } from '../../accounts/dto/create_account.dto';
import { AccountService } from '../../accounts/services/account.service';
import { AccountResponseInterface } from '../../accounts/interfaces/account.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  public async registerAccount(
    data: CreateAccountDto,
  ): Promise<AccountResponseInterface> {
    return this.accountService.createAccount(data);
  }

  public async login(data: CreateAccountDto): Promise<string> {
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

  public async verifyToken(token: string): Promise<string> {
    try {
      const decoded_payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const { id } = decoded_payload;

      const account = await this.accountService.findOne(id);
      if (!account) throw new UnauthorizedException('Invalid token');
      return token;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
