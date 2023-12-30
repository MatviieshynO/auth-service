import { ApiProperty } from '@nestjs/swagger';
import { UserGender, UserRole } from '@prisma/client';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordBodyDto {
  @ApiProperty({ example: 'Test123!' })
  @IsStrongPassword()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  currentPassword: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsStrongPassword()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  newPassword: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsStrongPassword()
  @IsNotEmpty({ message: 'Confirm password is required' })
  @IsString({ message: 'Confirm password must be a string' })
  confirmNewPassword: string;
}

export class OkResponseChangePasswordDto {
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

export class BadRequestChangePasswordDto {
  @ApiProperty({ example: ['Error of credentials'] })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 400 })
  status: number;
}

export class NotFoundChangePasswordDto {
  @ApiProperty({ example: ['User with id ${id} not found'] })
  message: string[];

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: 404 })
  status: number;
}
