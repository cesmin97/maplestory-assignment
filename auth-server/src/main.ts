/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  app.use(cookieParser());

  app.setGlobalPrefix('auth-server/api');

  const configService = app.get(ConfigService);
  const serverName = configService.get<number>('SERVER_NAME') || 'SERVER';
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`${serverName} is running on port ${port}`);
}
bootstrap();
