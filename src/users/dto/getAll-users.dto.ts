import { ApiProperty } from '@nestjs/swagger';
import { OkResponseDto } from './findOne-user.dto';

export class NotFoundGetAllDto {
  @ApiProperty({ example: ['No records found'] })
  message: string[];

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: 404 })
  status: number;
}
export class OkArrayResponseDto {
  @ApiProperty({ type: [OkResponseDto] })
  users: OkResponseDto[];
}
