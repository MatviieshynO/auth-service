import { ApiProperty } from '@nestjs/swagger';
import { UserGender, UserRole } from '@prisma/client';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsStrongPassword,
  IsIn,
} from 'class-validator';

export class CreateBodyUserDto {
  @ApiProperty({ example: 'firstName_test' })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  first_name: string;

  @ApiProperty({ example: 'family_name_test' })
  @IsNotEmpty({ message: 'Family name is required' })
  @IsString({ message: 'Family name must be a string' })
  family_name: string;

  @ApiProperty({ example: 'test@email.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ example: 'Test123!' })
  @IsStrongPassword()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  @ApiProperty({ example: 'Test123!' })
  @IsStrongPassword()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  confirm_password: string;

  @ApiProperty({ example: 'Male' })
  @IsNotEmpty({ message: 'Gender is required' })
  @IsIn(['Male', 'Female'], { message: 'Invalid gender' })
  gender: UserGender;

  @ApiProperty({ example: 'User' })
  @IsNotEmpty({ message: 'Role is required' })
  @IsIn(['Admin', 'User'], { message: 'Invalid role' })
  role: UserRole;
}

export class BadRequestResponseDto {
  @ApiProperty({ example: ['Error of credentials'] })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 400 })
  status: number;
}

export class CreatedResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test-firs_name' })
  first_name: string;

  @ApiProperty({ example: 'test-family_name' })
  family_name: string;

  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @ApiProperty({ example: 'Male' })
  gender: UserGender;

  @ApiProperty({ example: 'User' })
  role: UserRole;
}
