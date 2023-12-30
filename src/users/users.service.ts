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

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly passwordHashService: PasswordHashService,
  ) {}
  ////////////////////////
  // Create a new user //
  ///////////////////////

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
  ////////////////////////
  // Find a user by ID //
  //////////////////////

  async findOne(id: number): Promise<OkResponseDto | NotFoundFindOneDto> {
    try {
      const currentUser = await this.prismaService.users.findUnique({
        where: { id: id },
      });
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
      return {
        id,
        first_name,
        family_name,
        email,
        gender,
        role,
      };
    } catch (error) {
      throw error;
    }
  }

  ////////////////////
  // Get all users //
  ///////////////////

  async getAll(): Promise<OkArrayResponseDto | NotFoundGetAllDto> {
    try {
      const allUsers = await this.prismaService.users.findMany();
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
      return { users: allUsers };
    } catch (error) {
      throw error;
    }
  }

  ////////////////////
  // Update user //
  ///////////////////

  async update(
    id: number,
    updateUserBodyDto: UpdateUserBodyDto,
  ): Promise<OkResponseUpdateUserDto | NotFoundUpdateUserDto> {
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
    const updatedUser: Users = await this.prismaService.users.update({
      where: { id },
      data: { ...updateUserBodyDto },
    });
    const { first_name, family_name, email, gender, role } = updatedUser;
    return { id, first_name, family_name, email, gender, role };
  }
}
