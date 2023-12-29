import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  BadRequestResponseDto,
  CreatedResponseDto,
} from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'This endpoint is used to create a new user.',
  })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  @ApiBadRequestResponse({ type: BadRequestResponseDto })
  @ApiBody({ type: CreateUserDto, description: 'User data for registration' })
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreatedResponseDto | BadRequestResponseDto> {
    return this.usersService.create(createUserDto);
  }
}
