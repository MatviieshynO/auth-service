import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { Logger } from 'src/common/logger/logger.service';
import { CreateBodyUserDto } from '../dto/create-user.dto';
import { PrismaService } from 'src/db/prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class UsersUtilityService {
  constructor(
    private readonly logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * Handle error by logging and throwing it.
   * @param error - The error object.
   * @throws The original error.
   */
  handleError(error: any): never {
    if (!(error instanceof HttpException) && !error.response) {
      // Log the error for further analysis.
      this.logger.error(`Error creating a user: ${error.message}`);
    }

    // Throw the original error.
    throw error;
  }

  /**
   * Generate a random confirmation code.
   * @returns The generated confirmation code.
   */
  generateConfirmationCode(): number {
    return Math.floor(Math.random() * 90000000) + 10000000;
  }

  /**
   * Validate if passwords match.
   * @param password - The password to compare.
   * @param confirmPassword - The password to compare against.
   * @throws BadRequestException if passwords do not match.
   */
  validatePasswordMatch(password: string, confirmPassword: string): void {
    if (password !== confirmPassword) {
      throw new HttpException(
        {
          message: ['Passwords must match'],
          error: 'Bad Request',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Create a user in the database.
   * @param createUserDto - The user data.
   * @param hashedPassword - The hashed user password.
   * @returns The created user.
   */
  async createUserInDatabase(
    createUserDto: CreateBodyUserDto,
    hashedPassword: string,
  ): Promise<Users> {
    return await this.prismaService.users.create({
      data: {
        first_name: createUserDto.first_name,
        family_name: createUserDto.family_name,
        email: createUserDto.email,
        password: hashedPassword,
        gender: createUserDto.gender,
        role: createUserDto.role,
      },
    });
  }

  /**
   * Calculate token expiry date.
   * @param hours - The number of hours to add.
   * @returns The calculated expiry date.
   */
  calculateTokenExpiry(hours: number): Date {
    return dayjs().add(hours, 'hours').toDate();
  }

  /**
   * Get user response data.
   * @param user - The user object.
   * @returns The user data for response.
   */
  getResponseData(user: Users) {
    const { id, first_name, family_name, email, gender, role } = user;
    return { id, first_name, family_name, email, gender, role };
  }

  /**
   * Validate if the new password is different from the current one.
   * @param newPassword - The new password.
   * @param currentPassword - The current password.
   * @throws BadRequestException if passwords are the same.
   */
  validateNewPassword(newPassword: string, currentPassword: string): void {
    if (newPassword === currentPassword) {
      throw new HttpException(
        {
          message: ['The current and new password cannot be the same'],
          error: 'Bad Request',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Check if the user is not found.
   * @param user - The user object or null if not found.
   * @param userId - The user ID to include in the error message.
   * @throws NotFoundException if the user is not found.
   */
  checkUserNotFound(user: Users | null, userId: number): void {
    if (!user) {
      throw new HttpException(
        {
          message: [`User with id ${userId} not found`],
          error: 'Not Found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Check if records exist.
   * @param users - The array of users.
   * @throws NotFoundException if no records are found.
   */
  checkRecordsExistence(users: Users[]): void {
    if (!users.length) {
      throw new HttpException(
        {
          message: ['No records found'],
          error: 'Not Found',
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Handle error when the user already exists.
   * @param user - The existing user object.
   * @throws BadRequestException with 'Invalid credentials' message.
   */
  handleExistingUserError(user: Users): void {
    if (user) {
      throw new HttpException(
        {
          message: ['Invalid credentials'],
          error: 'Bad Request',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
