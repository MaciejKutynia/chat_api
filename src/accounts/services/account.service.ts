import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';

import { AccountEntity } from '../entities/account.entity';

import { CreateAccountDto, LoginData } from '../dto/create_account.dto';
import { AccountResponseInterface } from '../interfaces/account.interface';
import { generateRandomSegment } from '../../utils';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  public async createAccount(
    data: CreateAccountDto,
  ): Promise<AccountResponseInterface> {
    const { name, password: plain_password, email } = data;
    const existing_account = await this.accountRepository.findOne({
      where: { name: data.name },
    });
    if (existing_account)
      throw new ForbiddenException('Account already exists');
    const password = await this.createPassword(plain_password, 12);
    const register_token = crypto.randomUUID();
    const activation_code = generateRandomSegment(6);
    return this.returnAccountWithoutFields(
      await this.accountRepository.save({
        register_token,
        name,
        password,
        is_blocked: 1,
        activation_code,
        email,
      }),
    );
  }

  public async resetPassword(plain_password: string, id: number) {
    const password = await this.createPassword(plain_password, 12);
    await this.updateAccount(id, { password });
  }

  public async updateAccount(id: number, data: Partial<AccountEntity>) {
    await this.accountRepository.update(id, { ...data });
  }

  public async findByField(value: string, field: keyof AccountEntity) {
    return this.returnAccountWithoutFields(
      await this.accountRepository.findOne({ where: { [field]: value } }),
    );
  }

  public async findOne(id: number): Promise<AccountResponseInterface> {
    return this.returnAccountWithoutFields(
      await this.accountRepository.findOne({ where: { id } }),
    );
  }

  public async validateUser(
    data: LoginData,
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
    account: AccountEntity | null = null,
    fields: string[] = [],
  ): AccountResponseInterface {
    if (!account) return {};
    const default_fields = ['password'];
    for (const field of [...default_fields, ...fields]) {
      delete account[field];
    }
    return account;
  }
}
