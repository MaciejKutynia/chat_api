import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from '../entities/chat.entity';
import { Repository } from 'typeorm';
import { generateUUID } from '../../utils';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
  ) {}

  public async getChats(account_id: number): Promise<ChatEntity[]> {
    return this.chatRepository.find({ where: { account_id } });
  }

  public async getSpecificChat(url_key: string): Promise<ChatEntity> {
    return this.chatRepository.findOne({ where: { url_key } });
  }

  public async createNewChat(
    name: string,
    account_id: number,
  ): Promise<ChatEntity> {
    const url_key = generateUUID();
    return this.chatRepository.save({ url_key, name, account_id });
  }
}
