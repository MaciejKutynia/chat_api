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

  async getChats(account_id: number) {
    return this.chatRepository.find({ where: { account_id } });
  }

  async getSpecificChat(url_key: string) {
    return this.chatRepository.findOne({ where: { url_key } });
  }

  async createNewChat(name: string, account_id: number) {
    const url_key = generateUUID();
    return this.chatRepository.save({ url_key, name, account_id });
  }
}
