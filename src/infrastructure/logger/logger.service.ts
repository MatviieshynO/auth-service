import * as winston from 'winston';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Logger {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'logs/api.log',
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            this.customLogFormat(),
          ),
        }),
      ],
    });
  }

  info(message: string) {
    this.logger.info(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  private customLogFormat() {
    return winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    });
  }
}
