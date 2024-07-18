import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { NewUserInterface } from '../interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async getUsersForChat(url_key: string, account_id: number) {
    return this.usersRepository.find({ where: { url_key, account_id } });
  }

  async createNewUser(userData: NewUserInterface, account_id: number) {
    return this.usersRepository.save({ ...userData, account_id });
  }
}
