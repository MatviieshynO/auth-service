import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from '@prisma/client';
import { Logger } from 'src/common/logger/logger.service';
import { PasswordHashService } from './password-hash/password-hash.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
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
            first_name: createUserDto.first_name,
            family_name: createUserDto.family_name,
            email: createUserDto.email,
            password: hashedPassword,
            gender: createUserDto.gender,
            role: createUserDto.role,
          },
        });

      // Return the ID of the created user
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
