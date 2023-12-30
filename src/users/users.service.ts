import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import {
  CreateBodyUserDto,
  BadRequestResponseDto,
  CreatedResponseDto,
} from './dto/create-user.dto';
import { Users } from '@prisma/client';
import { Logger } from 'src/common/logger/logger.service';
import { PasswordHashService } from './password-hash/password-hash.service';
import { NotFoundFindOneDto, OkResponseDto } from './dto/findOne-user.dto';
import { NotFoundGetAllDto, OkArrayResponseDto } from './dto/getAll-users.dto';
import {
  NotFoundUpdateUserDto,
  OkResponseUpdateUserDto,
  UpdateUserBodyDto,
} from './dto/update.user.dto';
import {
  OkResponseDeleteUserDto,
  NotFoundDeleteUserDto,
} from './dto/delete-user.dto';
import {
  BadRequestChangePasswordDto,
  ChangePasswordBodyDto,
  NotFoundChangePasswordDto,
  OkResponseChangePasswordDto,
} from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  // *******************************
  // Create a new user
  // *******************************

  async create(
    createUserDto: CreateBodyUserDto,
  ): Promise<BadRequestResponseDto | CreatedResponseDto> {
    try {
      // Check if passwords match
      if (createUserDto.password !== createUserDto.confirm_password) {
        throw new HttpException(
          {
            message: ['Passwords must match'],
            error: 'Bad Request',
            status: HttpStatus.BAD_REQUEST,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if a user with the given email already exists
      const existingUser: Users | null =
        await this.prismaService.users.findUnique({
          where: { email: createUserDto.email },
        });

      if (existingUser) {
        throw new HttpException(
          {
            message: ['Invalid credentials'],
            error: 'Bad Request',
            status: HttpStatus.BAD_REQUEST,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Hash the password before saving it to the database
      const hashedPassword: string =
        await this.passwordHashService.hashPassword(createUserDto.password);

      // Create a new user in the database
      const { id, first_name, family_name, email, gender, role } =
        await this.prismaService.users.create({
          data: {
            ...createUserDto,
            password: hashedPassword,
          },
        });

      // Return the data of the created user
      return { id, first_name, family_name, email, gender, role };
    } catch (error) {
      // Log errors and re-throw them
      if (!(error instanceof HttpException) && !error.response) {
        this.logger.error(`Error creating a user: ${error.message}`);
      }

      throw error;
    }
  }

  // *******************************
  // Find a user by ID
  // *******************************

  async findOne(id: number): Promise<OkResponseDto | NotFoundFindOneDto> {
    try {
      // Retrieve the user with the specified ID from the database
      const currentUser = await this.prismaService.users.findUnique({
        where: { id: id },
      });

      // Check if the user with the specified ID is not found
      if (!currentUser) {
        throw new HttpException(
          {
            message: [`User with id ${id} not found`],
            error: 'Not Found',
            status: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const { first_name, family_name, email, gender, role } = currentUser;

      // Return a response with the user details
      return {
        id,
        first_name,
        family_name,
        email,
        gender,
        role,
      };
    } catch (error) {
      // Log errors and re-throw them
      if (!(error instanceof HttpException) && !error.response) {
        this.logger.error(`Error creating a user: ${error.message}`);
      }

      throw error;
    }
  }

  // *******************************
  // Get all users
  // *******************************

  async getAll(): Promise<OkArrayResponseDto | NotFoundGetAllDto> {
    try {
      // Retrieve all users from the database
      const allUsers = await this.prismaService.users.findMany();

      // Check if there are no records found
      if (!allUsers.length) {
        throw new HttpException(
          {
            message: [`No records found`],
            error: 'Not Found',
            status: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Return a response with the list of users
      return { users: allUsers };
    } catch (error) {
      // Log errors and re-throw them
      if (!(error instanceof HttpException) && !error.response) {
        this.logger.error(`Error creating a user: ${error.message}`);
      }

      throw error;
    }
  }

  // *******************************
  // Update user
  // *******************************

  async update(
    id: number,
    updateUserBodyDto: UpdateUserBodyDto,
  ): Promise<OkResponseUpdateUserDto | NotFoundUpdateUserDto> {
    try {
      // Check if the user exists
      const existingUser: Users | null =
        await this.prismaService.users.findUnique({
          where: { id },
        });

      // If the user doesn't exist, throw a Not Found exception
      if (!existingUser) {
        throw new HttpException(
          {
            message: [`User with id ${id} not found`],
            error: 'Not Found',
            status: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Update the user in the database
      const updatedUser: Users = await this.prismaService.users.update({
        where: { id },
        data: { ...updateUserBodyDto },
      });
      const { first_name, family_name, email, gender, role } = updatedUser;

      // Return a response with the updated user's details
      return { id, first_name, family_name, email, gender, role };
    } catch (error) {
      // Log errors and re-throw them
      if (!(error instanceof HttpException) && !error.response) {
        this.logger.error(`Error creating a user: ${error.message}`);
      }

      throw error;
    }
  }
  // *******************************
  // Delete user
  // *******************************

  async delete(
    id: number,
  ): Promise<OkResponseDeleteUserDto | NotFoundDeleteUserDto> {
    try {
      // Check if the user exists
      const existingUser: Users | null =
        await this.prismaService.users.findUnique({
          where: { id },
        });

      // If the user doesn't exist, throw a Not Found exception
      if (!existingUser) {
        throw new HttpException(
          {
            message: [`User with id ${id} not found`],
            error: 'Not Found',
            status: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Delete the user from the database
      const deletedUser: Users = await this.prismaService.users.delete({
        where: { id },
      });
      const { first_name, family_name, email, gender, role } = deletedUser;

      // Return a response with the deleted user's details
      return { id, first_name, family_name, email, gender, role };
    } catch (error) {
      // Log errors and re-throw them
      if (!(error instanceof HttpException) && !error.response) {
        this.logger.error(`Error creating a user: ${error.message}`);
      }

      throw error;
    }
  }

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
      if (
        changePasswordBodyDto.newPassword !==
        changePasswordBodyDto.confirmNewPassword
      ) {
        throw new HttpException(
          {
            message: ['Passwords must match'],
            error: 'Bad Request',
            status: HttpStatus.BAD_REQUEST,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if the new password is different from the current one
      if (
        changePasswordBodyDto.newPassword ===
        changePasswordBodyDto.currentPassword
      ) {
        throw new HttpException(
          {
            message: ['The current and new password cannot be the same'],
            error: 'Bad Request',
            status: HttpStatus.BAD_REQUEST,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Find an existing user by their identifier
      const existingUser: Users | null =
        await this.prismaService.users.findUnique({
          where: { id },
        });

      if (!existingUser) {
        throw new HttpException(
          {
            message: [`User with id ${id} not found`],
            error: 'Not Found',
            status: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }

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
      const { first_name, family_name, email, gender, role } = updatedUser;
      return { id, first_name, family_name, email, gender, role };
    } catch (error) {
      // Log errors and re-throw them
      if (!(error instanceof HttpException) && !error.response) {
        this.logger.error(`Error creating a user: ${error.message}`);
      }

      throw error;
    }
  }
}
