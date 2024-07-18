import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountDto } from '../dto/create_account.dto';
import { AccountService } from '../services/account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
}
