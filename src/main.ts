import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from './common/logger/logger.service';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

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
  // Validator pipe
  app.useGlobalPipes(new ValidationPipe());
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
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('auth-service')
    .setDescription('The auth-service API ')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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
