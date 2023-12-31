import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import {
  CreateBodyUserDto,
  BadRequestResponseDto,
  CreatedResponseDto,
} from '../dto/create-user.dto';
import { Users } from '@prisma/client';
import { PasswordHashService } from '../password-hash/password-hash.service';
import { NotFoundFindOneDto, OkResponseDto } from '../dto/findOne-user.dto';
import { NotFoundGetAllDto, OkArrayResponseDto } from '../dto/getAll-users.dto';
import {
  NotFoundUpdateUserDto,
  OkResponseUpdateUserDto,
  UpdateUserBodyDto,
} from '../dto/update.user.dto';
import {
  OkResponseDeleteUserDto,
  NotFoundDeleteUserDto,
} from '../dto/delete-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/common/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { UsersUtilityService } from './users-utility.service';

@Injectable()
export class UsersCrudService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordHashService: PasswordHashService,
    private readonly confirmEmailJwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly usersUtilityService: UsersUtilityService,
  ) {}

  // *******************************
  // Create a new user
  // *******************************

  async create(
    createUserDto: CreateBodyUserDto,
  ): Promise<BadRequestResponseDto | CreatedResponseDto> {
    try {
      // Check if passwords match
      this.usersUtilityService.validatePasswordMatch(
        createUserDto.password,
        createUserDto.confirm_password,
      );

      // Check if a user with the given email already exists
      const existingUser: Users | null =
        (await this.prismaService.users.findUnique({
          where: { email: createUserDto.email },
        })) as Users;

      // Handle the error related to an existing user
      this.usersUtilityService.handleExistingUserError(existingUser);

      // Hash the password before saving it to the database
      const hashedPassword: string =
        await this.passwordHashService.hashPassword(createUserDto.password);

      // Create a new user in the database
      const newUser = await this.usersUtilityService.createUserInDatabase(
        createUserDto,
        hashedPassword,
      );

      // Generate an email confirmation token
      const token: string = await this.confirmEmailJwtService.signAsync({
        userId: newUser.id,
        userEmail: newUser.email,
      });

      // Generate a confirmation code
      const confirm_code: number =
        this.usersUtilityService.generateConfirmationCode();

      // Get the API_URL from the configuration
      const API_URL: string | undefined =
        this.configService.get<string>('API_URL');

      // Create a verification link for email confirmation
      const verificationLink: string = `${API_URL}/auth/confirm-email/${token}`;

      // Send an email confirmation to the user
      this.mailerService.sendEmailConfirmation(
        newUser.first_name,
        verificationLink,
        `${confirm_code}`,
        newUser.email,
      );

      // Calculate the token expiry date (12 hours from now)
      const token_expiry: Date =
        this.usersUtilityService.calculateTokenExpiry(12);

      // Save the email verification details in the database
      await this.prismaService.emailVerification.create({
        data: {
          user_id: newUser.id,
          token,
          token_expiry,
          confirm_code,
        },
      });

      // Return the data of the created user
      return this.usersUtilityService.getResponseData(newUser);
    } catch (error) {
      // Log errors and re-throw them
      this.usersUtilityService.handleError(error);
    }
  }

  // *******************************
  // Get a user by ID
  // *******************************

  async findOne(id: number): Promise<OkResponseDto | NotFoundFindOneDto> {
    try {
      // Retrieve the user with the specified ID from the database
      const currentUser: Users | null =
        (await this.prismaService.users.findUnique({
          where: { id },
        })) as Users;

      // Check if the user with the specified ID is not found
      this.usersUtilityService.checkUserNotFound(currentUser, id);

      // Return a response with the user details
      return this.usersUtilityService.getResponseData(currentUser);
    } catch (error) {
      // Log errors and re-throw them
      this.usersUtilityService.handleError(error);
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
      this.usersUtilityService.checkRecordsExistence(allUsers);

      // Return a response with the list of users
      return { users: allUsers };
    } catch (error) {
      // Log errors and re-throw them
      this.usersUtilityService.handleError(error);
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
      this.usersUtilityService.checkUserNotFound(existingUser, id);

      // Update the user in the database
      const updatedUser: Users = await this.prismaService.users.update({
        where: { id },
        data: { ...updateUserBodyDto },
      });

      // Return a response with the updated user's details
      return this.usersUtilityService.getResponseData(updatedUser);
    } catch (error) {
      // Log errors and re-throw them
      this.usersUtilityService.handleError(error);
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
      this.usersUtilityService.checkUserNotFound(existingUser, id);

      // Delete the user from the database
      const deletedUser: Users = await this.prismaService.users.delete({
        where: { id },
      });

      // Return a response with the deleted user's details
      return this.usersUtilityService.getResponseData(deletedUser);
    } catch (error) {
      // Log errors and re-throw them
      this.usersUtilityService.handleError(error);
    }
  }
}
