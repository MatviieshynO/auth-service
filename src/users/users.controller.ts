import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
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
import { NotFoundGetAllDto, OkArrayResponseDto } from './dto/getAll-users.dto';
import {
  NotFoundUpdateUserDto,
  OkResponseUpdateUserDto,
  UpdateUserBodyDto,
} from './dto/update.user.dto';
import {
  NotFoundDeleteUserDto,
  OkResponseDeleteUserDto,
} from './dto/delete-user.dto';

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
  @ApiOperation({
    summary: 'Get user by id',
    description: 'This endpoint is used to search for a user by id.',
  })
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

  ////////////////////
  // Get all users //
  ///////////////////

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'This endpoint is used to get all users.',
  })
  @ApiOkResponse({ type: OkArrayResponseDto, description: 'OK.' })
  @ApiNotFoundResponse({
    type: NotFoundGetAllDto,
    description: 'Not Found.',
  })
  async getAll(): Promise<OkArrayResponseDto | NotFoundGetAllDto> {
    return await this.usersService.getAll();
  }

  ////////////////////
  // Update user //
  ///////////////////

  @Put(':id')
  @ApiOperation({
    summary: 'Update user by id',
    description: 'This endpoint is used to update user by id.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiOkResponse({ type: OkResponseUpdateUserDto, description: 'OK.' })
  @ApiNotFoundResponse({
    type: NotFoundUpdateUserDto,
    description: 'Not Found.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserBodyDto: UpdateUserBodyDto,
  ): Promise<OkResponseUpdateUserDto | NotFoundUpdateUserDto> {
    return await this.usersService.update(id, updateUserBodyDto);
  }

  ////////////////////
  // Delete user //
  ///////////////////
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiOperation({
    summary: 'Delete user by id',
    description: 'This endpoint is used to delete user by id.',
  })
  @ApiOkResponse({ type: OkResponseDeleteUserDto, description: 'OK.' })
  @ApiNotFoundResponse({
    type: NotFoundDeleteUserDto,
    description: 'Not Found.',
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OkResponseDeleteUserDto | NotFoundDeleteUserDto> {
    return await this.usersService.delete(id);
  }
}
