import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { LoggerModule } from 'src/common/logger/logger.module';
import { PasswordHashService } from './password-hash/password-hash.service';
import { MailModule } from 'src/common/mailer/mailer.module';

@Module({
  imports: [PrismaModule, LoggerModule, MailModule],
  controllers: [UsersController],
  providers: [UsersService, PasswordHashService],
})
export class UsersModule {}
