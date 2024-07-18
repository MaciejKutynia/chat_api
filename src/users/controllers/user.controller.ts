import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { NewUserInterface } from '../interfaces/user.interface';
import { Request } from 'express';
import { AuthGuard } from '../../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get(':url_key')
  async getUsersForChat(
    @Param('url_key') url_key: string,
    @Req() req: Request,
  ) {
    const { id } = req?.account || {};
    return this.usersService.getUsersForChat(url_key, id);
  }

  @Post()
  async createNewUser(@Body() userData: NewUserInterface, @Req() req: Request) {
    const { id } = req?.account || {};
    return this.usersService.createNewUser(userData, id);
  }
}
