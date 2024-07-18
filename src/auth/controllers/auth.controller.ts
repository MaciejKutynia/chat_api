import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateAccountDto } from '../../accounts/dto/create_account.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerAccount(@Body() data: CreateAccountDto) {
    return this.authService.registerAccount(data);
  }

  @Post('login')
  @HttpCode(200)
  async loginAccount(@Body() data: CreateAccountDto) {
    return this.authService.login(data);
  }

  @Post('verify-token')
  @HttpCode(200)
  async verifyToken(@Body() data: { token: string }) {
    return this.authService.verifyToken(data.token);
  }
}
