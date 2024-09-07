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
import { AccountResponseInterface } from '../interfaces/account.interface';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  public async createAccount(
    data: CreateAccountDto,
  ): Promise<AccountResponseInterface> {
    const existing_account = await this.accountRepository.findOne({
      where: { name: data.name },
    });
    if (existing_account)
      throw new ForbiddenException('Account already exists');
    const password = await this.createPassword(data.password, 12);
    const account = await this.accountRepository.save({
      name: data.name,
      password,
    });
    return this.returnAccountWithoutFields(account);
  }

  public async findOne(id: number): Promise<AccountResponseInterface> {
    const account = await this.accountRepository.findOne({ where: { id } });
    return this.returnAccountWithoutFields(account);
  }

  public async validateUser(
    data: CreateAccountDto,
  ): Promise<AccountResponseInterface> {
    const { name, password } = data;
    const account = await this.accountRepository.findOne({ where: { name } });
    if (!account) return null;
    const is_passwords_match = await this.comparePassword(
      password,
      account.password,
    );
    if (!is_passwords_match) return null;
    return this.returnAccountWithoutFields(account);
  }

  private async createPassword(
    password: string,
    saltNum: number,
    length?: number,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltNum);
    const hashed_password = await bcrypt.hash(password, salt);
    return length ? hashed_password.slice(0, length) : hashed_password;
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  private returnAccountWithoutFields(
    account: AccountEntity,
    fields: string[] = [],
  ): AccountResponseInterface {
    const default_fields = ['password'];
    for (const field of [...default_fields, ...fields]) {
      delete account[field];
    }
    return account;
  }
}
