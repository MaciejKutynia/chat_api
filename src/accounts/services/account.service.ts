import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '../entities/account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from '../dto/create_account.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async createPassword(
    password: string,
    saltNum: number,
    length?: number,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltNum);
    const hashedPassword = await bcrypt.hash(password, salt);
    return length ? hashedPassword.slice(0, length) : hashedPassword;
  }

  async createAccount(data: CreateAccountDto) {
    const account = await this.accountRepository.findOne({
      where: { name: data.name },
    });
    if (account) throw new ForbiddenException('Account already exists');
    const password = await this.createPassword(data.password, 12);
    return this.accountRepository.save({ name: data.name, password });
  }

  async findOne(id: number) {
    return this.accountRepository.findOne({ where: { id } });
  }

  async validateUser(data: CreateAccountDto) {
    const { name, password } = data;
    const account = await this.accountRepository.findOne({ where: { name } });
    if (!account) return null;
    const matchPassword = await this.comparePassword(
      password,
      account.password,
    );
    if (!matchPassword) return null;
    const { password: accountPassword, ...rest } = account;
    return rest;
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
