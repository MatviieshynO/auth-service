import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import {
  ChangePasswordBodyDto,
  OkResponseChangePasswordDto,
  BadRequestChangePasswordDto,
  NotFoundChangePasswordDto,
} from '../dto/change-password.dto';
import { PrismaService } from 'src/db/prisma.service';
import { PasswordHashService } from '../password-hash/password-hash.service';
import { UsersUtilityService } from './users-utility.service';

@Injectable()
export class UsersActionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordHashService: PasswordHashService,
    private readonly usersUtilityService: UsersUtilityService,
  ) {}

  // *******************************
  // Change password
  // *******************************

  async changePassword(
    id: number,
    changePasswordBodyDto: ChangePasswordBodyDto,
  ): Promise<
    | OkResponseChangePasswordDto
    | BadRequestChangePasswordDto
    | NotFoundChangePasswordDto
  > {
    try {
      // Check if passwords match
      this.usersUtilityService.validatePasswordMatch(
        changePasswordBodyDto.newPassword,
        changePasswordBodyDto.confirmNewPassword,
      );

      // Check if the new password is different from the current one
      this.usersUtilityService.validateNewPassword(
        changePasswordBodyDto.newPassword,
        changePasswordBodyDto.currentPassword,
      );

      // Find an existing user by their identifier
      const existingUser: Users = (await this.prismaService.users.findUnique({
        where: { id },
      })) as Users;

      // Check for the presence of the user and handle an error if it's missing
      this.usersUtilityService.checkUserNotFound(existingUser, id);

      // Check the current user password
      const isCurrentPasswordValid: boolean =
        await this.passwordHashService.comparePasswords(
          changePasswordBodyDto.currentPassword,
          existingUser.password,
        );
      if (!isCurrentPasswordValid) {
        throw new HttpException(
          {
            message: ['Current password is incorrect'],
            error: 'Bad Request',
            status: HttpStatus.BAD_REQUEST,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Hash the new password
      const hashedNewPassword: string =
        await this.passwordHashService.hashPassword(
          changePasswordBodyDto.newPassword,
        );

      // Update the user password in the database
      const updatedUser: Users = await this.prismaService.users.update({
        where: { id },
        data: { password: hashedNewPassword },
      });

      // Prepare a response with updated user data
      return this.usersUtilityService.getResponseData(updatedUser);
    } catch (error) {
      // Log errors and re-throw them
      this.usersUtilityService.handleError(error);
    }
  }
}
