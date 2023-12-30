import { ApiProperty } from '@nestjs/swagger';
import { UserGender, UserRole } from '@prisma/client';

export class NotFoundFindOneDto {
  @ApiProperty({ example: ['User with id ${id} not found'] })
  message: string[];

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: 404 })
  status: number;
}

export class OkResponseDto {
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
