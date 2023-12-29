import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { LoggerModule } from 'src/common/logger/logger.module';
import { PasswordHashService } from './password-hash.service';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [UsersController],
  providers: [UsersService, PasswordHashService],
})
export class UsersModule {}
