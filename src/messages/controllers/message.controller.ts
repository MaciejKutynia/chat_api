import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { NewMessageInterface } from '../interface/messages.interface';
import { MessageService } from '../services/message.service';
import { AuthGuard } from '../../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':url_key')
  async getMessages(@Param('url_key') url_key: string, @Req() req: Request) {
    const { id } = req?.account || {};
    return this.messageService.getMessages(url_key, id);
  }

  @Post()
  async createNewMessage(
    @Body() newMessage: NewMessageInterface,
    @Req() req: Request,
  ) {
    const { id } = req?.account || {};
    return this.messageService.createNewMessage(newMessage, id);
  }
}
