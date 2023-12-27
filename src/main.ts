import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const API_PORT: number = configService.get<number>('API_PORT') || 3000;
  const API_HOST: string = configService.get<string>('API_HOST') || '127.0.0.1';

  await app.listen(API_PORT, API_HOST);
}
bootstrap();
