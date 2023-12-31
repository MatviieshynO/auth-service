import { Module } from '@nestjs/common';
import { UsersCrudService } from './users-services/users-crud.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { LoggerModule } from 'src/common/logger/logger.module';
import { PasswordHashService } from './password-hash/password-hash.service';
import { MailModule } from 'src/common/mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersActionsService } from './users-services/users-actions.service';
import { UsersUtilityService } from './users-services/users-utility.service';

@Module({
  imports: [
    PrismaModule,
    LoggerModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('CONFIRM_EMAIL_JWT'),
        signOptions: {
          expiresIn: '12h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersCrudService,
    PasswordHashService,
    UsersActionsService,
    UsersUtilityService,
  ],
})
export class UsersModule {}
