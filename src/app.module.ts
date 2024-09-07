import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/middlewares/auth.middleware';
import { ChatModule } from './chats/chat.module';
import { UserModule } from './users/user.module';
import { MessageModule } from './messages/message.module';

@Module({
  imports: [
    AuthModule,
    ChatModule,
    MessageModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        await ConfigModule.envVariablesLoaded;
        return {
          type: 'mysql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('/auth/*').forRoutes('*');
  }
}
