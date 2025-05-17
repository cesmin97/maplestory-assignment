/* eslint-disable prettier/prettier */
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const serverName = configService.get<number>('SERVER_NAME') || 'SERVER';
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`${serverName} is running on port ${port}`);
}
bootstrap();
