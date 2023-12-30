import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateBodyUserDto,
  BadRequestResponseDto,
  CreatedResponseDto,
} from './dto/create-user.dto';
import { NotFoundFindOneDto, OkResponseDto } from './dto/findOne-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  ////////////////////////
  // Create a new USer //
  //////////////////////
  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'This endpoint is used to create a new user.',
  })
  @ApiCreatedResponse({ type: CreatedResponseDto, description: 'CREATED.' })
  @ApiBadRequestResponse({
    type: BadRequestResponseDto,
    description: 'BAD REQUEST.',
  })
  @ApiBody({
    type: CreateBodyUserDto,
    description: 'BODY ',
  })
  async create(
    @Body() createUserDto: CreateBodyUserDto,
  ): Promise<CreatedResponseDto | BadRequestResponseDto> {
    return await this.usersService.create(createUserDto);
  }

  ////////////////////////
  // Find a user by ID //
  //////////////////////
  @Get(':id')
  @ApiOkResponse({ type: OkResponseDto, description: 'OK.' })
  @ApiNotFoundResponse({
    type: NotFoundFindOneDto,
    description: 'Not Found.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OkResponseDto | NotFoundFindOneDto> {
    return await this.usersService.findOne(id);
  }
}
