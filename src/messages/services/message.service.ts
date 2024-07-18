import { Injectable } from '@nestjs/common';
import { NewMessageInterface } from '../interface/messages.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async getMessages(url_key: string, account_id: number) {
    const messages = await this.messageRepository.find({
      where: { account_id, url_key },
      order: { timestamp: 'ASC' },
    });
    return messages.map(({ timestamp, ...rest }) => ({
      ...rest,
      date: new Date(Number(timestamp)).toLocaleString('pl-PL', {
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    }));
  }

  async createNewMessage(newMessage: NewMessageInterface, account_id: number) {
    const timestamp = new Date().getTime();
    return this.messageRepository.save({
      ...newMessage,
      account_id,
      timestamp,
    });
  }
}
