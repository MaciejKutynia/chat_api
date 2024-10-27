import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

import { AccountService } from '../../accounts/services/account.service';
import { EmailService } from '../../email/services/email.service';

import {
  CreateAccountDto,
  LoginData,
} from '../../accounts/dto/create_account.dto';
import { generateRandomSegment } from '../../utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  public async registerAccount(data: CreateAccountDto): Promise<string> {
    const { email } = data;
    const { name, register_token } =
      await this.accountService.createAccount(data);
    const emailData = {
      name,
      token: register_token,
    };
    await this.emailService.sendEmail({
      emailContentData: emailData,
      subject: 'Rejestracja w Chatter',
      to: email,
      type: 'register',
    });
    await this.sendActivationCode(register_token, false);
    return 'success';
  }

  public async login(data: LoginData): Promise<string> {
    const account = await this.accountService.validateUser(data);
    if (!account)
      throw new UnauthorizedException('Dane logowania są nie poprawne');

    if (account.is_blocked)
      throw new NotFoundException('Konto nie zostało aktywowane');

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

  public async sendActivationCode(token: string, again = true) {
    const { activation_code, name, email, id } =
      await this.accountService.findByField(token, 'register_token');
    if (!email) throw new UnauthorizedException('Konto nie istnieje');

    let code = activation_code;

    if (again) {
      const new_activation_code = generateRandomSegment(6);
      await this.accountService.updateAccount(id, {
        activation_code: new_activation_code,
      });
      code = new_activation_code;
    }

    await this.emailService.sendEmail({
      emailContentData: {
        token: code,
        name,
      },
      to: email,
      subject: 'Kod aktywacyjny do aplikacji Chatter',
      type: 'activation-code',
    });
  }

  public async forgotPassword(email: string) {
    const { name, id } = await this.accountService.findByField(email, 'email');
    if (!email) throw new UnauthorizedException('Konto nie istnieje');
    const rp_token = crypto.randomUUID();
    await this.accountService.updateAccount(id, { rp_token });
    await this.emailService.sendEmail({
      emailContentData: {
        name,
        token: rp_token,
      },
      to: email,
      subject: 'Reset hasła',
      type: 'reset-password',
    });
  }

  public async resetPassword(password: string, token: string) {
    const { id } = await this.accountService.findByField(token, 'rp_token');
    if (!id) throw new UnauthorizedException('Konto nie istnieje');
    return this.accountService.resetPassword(password, id);
  }

  public async activateAccount(token: string, code: string) {
    const { id, activation_code } = await this.accountService.findByField(
      token,
      'register_token',
    );
    console.log(id);
    if (!id) throw new UnauthorizedException('Konto nie istnieje');
    if (code !== activation_code)
      throw new NotFoundException('Kod jest niepoprawny');
    await this.accountService.updateAccount(id, {
      is_blocked: 0,
      activation_code: null,
      register_token: null,
    });
  }
}
