import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

import * as process from 'process';

import { AccountService } from 'src/accounts/services/account.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private accountService: AccountService,
  ) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')?.[1];
    if (token) {
      try {
        const decoded = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });
        const account = await this.accountService.findOne(decoded.id);
        if (account) {
          req.account = {
            id: account.id,
          };
        }
      } catch (error) {
        next(new UnauthorizedException('Token expired'));
      }
    }
    next();
  }
}
