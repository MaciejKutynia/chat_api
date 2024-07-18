import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const corsOptions = {
    origin: [`http://${process.env.DB_HOST}:80`, 'http://localhost:4200'],
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Origin, Authorization, Cookie',
    preflightContinue: false,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };

  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
