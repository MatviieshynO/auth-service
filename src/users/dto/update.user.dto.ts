import { ApiProperty } from '@nestjs/swagger';
import { UserGender, UserRole } from '@prisma/client';

export class UpdateUserBodyDto {
  @ApiProperty({ example: 'firstName_test' })
  first_name: string;

  @ApiProperty({ example: 'family_name_test' })
  family_name: string;

  @ApiProperty({ example: 'Male' })
  gender: UserGender;
}

export class OkResponseUpdateUserDto {
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
export class NotFoundUpdateUserDto {
  @ApiProperty({ example: ['User with id ${id} not found'] })
  message: string[];

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: 404 })
  status: number;
}
