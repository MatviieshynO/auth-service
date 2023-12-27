import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from './infrastructure/logger/logger.service';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const API_PORT: number = configService.get<number>('API_PORT') || 3000;
  const API_HOST: string = configService.get<string>('API_HOST') || 'localhost';
  const API_PROTOCOl: string | undefined =
    configService.get<string>('API_PROTOCOl');
  const ALLOWED_ORIGIN: string | undefined =
    configService.get<string>('ALLOWED_ORIGIN');

  const logger = app.get(Logger);
  // Config
  app.enableCors({
    origin: ALLOWED_ORIGIN,
  });
  // Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
  );

  try {
    await app.listen(API_PORT, API_HOST, () => {
      logger.info(
        `Server is running on ${API_PROTOCOl}${API_HOST}:${API_PORT}`,
      );
    });
  } catch (error) {
    logger.error(
      `Failed to start server. Error details: ${error.message}, Stack trace: ${error.stack}`,
    );
  }
}
bootstrap();
