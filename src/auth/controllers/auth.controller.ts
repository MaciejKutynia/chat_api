import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import {
  CreateAccountDto,
  LoginData,
} from '../../accounts/dto/create_account.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('activate-code/:token')
  async sendActivateAccount(@Param('token') token: string) {
    return this.authService.sendActivationCode(token);
  }

  @Get('forgot-password/:email')
  async forgotPassword(@Param('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('activate-account/:token')
  async activateAccount(
    @Param('token') token: string,
    @Body() { code }: { code: string },
  ) {
    console.log({ code });
    return this.authService.activateAccount(token, code);
  }

  @HttpCode(200)
  @Post('register')
  async registerAccount(@Body() data: CreateAccountDto) {
    return this.authService.registerAccount(data);
  }

  @Post('login')
  @HttpCode(200)
  async loginAccount(@Body() data: LoginData) {
    return this.authService.login(data);
  }

  @Post('verify-token')
  @HttpCode(200)
  async verifyToken(@Body() data: { token: string }) {
    return this.authService.verifyToken(data.token);
  }

  @Post('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body() password: string) {
    return this.authService.resetPassword(password, token);
  }
}
