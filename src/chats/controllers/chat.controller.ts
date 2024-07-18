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

import { AuthGuard } from '../../auth/guards/auth.guard';
import { ChatService } from '../services/chat.service';

@UseGuards(AuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getAllChats(@Req() req: Request) {
    const { id } = req?.account || {};
    return this.chatService.getChats(id);
  }

  @Get(':url_key')
  async getChatData(@Param('url_key') url_key: string) {
    return this.chatService.getSpecificChat(url_key);
  }

  @Post()
  async createNewChat(@Body() { name }: { name: string }, @Req() req: Request) {
    const { id } = req?.account || {};
    return this.chatService.createNewChat(name, id);
  }
}
