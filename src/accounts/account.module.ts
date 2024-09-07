import { Module } from '@nestjs/common';
import { AccountService } from './services/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
