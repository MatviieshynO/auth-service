import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersCrudService } from './users-services/users-crud.service';
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
import {
  BadRequestChangePasswordDto,
  ChangePasswordBodyDto,
  NotFoundChangePasswordDto,
  OkResponseChangePasswordDto,
} from './dto/change-password.dto';
import { UsersActionsService } from './users-services/users-actions.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersCrudService: UsersCrudService,
    private readonly usersActionsService: UsersActionsService,
  ) {}

  // *************************************
  // User-related CRUD operations
  // *************************************

  /**
   * Create a new user in the database.
   * @param createUserDto - Data for creating a new user.
   * @returns A response indicating success or failure.
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Endpoint to create a new user.',
  })
  @ApiCreatedResponse({
    type: CreatedResponseDto,
    description: 'User successfully created.',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponseDto,
    description: 'Bad request. Please check your request payload.',
  })
  @ApiBody({
    type: CreateBodyUserDto,
    description: 'Request body containing user details for creation.',
  })
  async create(
    @Body() createUserDto: CreateBodyUserDto,
  ): Promise<CreatedResponseDto | BadRequestResponseDto> {
    return await this.usersCrudService.create(createUserDto);
  }

  /**
   * Retrieve information about a user by their ID.
   * @param userId - The ID of the user to retrieve.
   * @returns User information or an error response if not found.
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve user details based on the provided user ID.',
  })
  @ApiOkResponse({
    type: OkResponseDto,
    description: 'Successfully retrieved user details.',
  })
  @ApiNotFoundResponse({
    type: NotFoundFindOneDto,
    description: 'User with the specified ID not found.',
  })
  @ApiParam({
    name: 'id',
    description: 'Numeric ID of the user to be retrieved.',
    type: Number,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OkResponseDto | NotFoundFindOneDto> {
    return await this.usersCrudService.findOne(id);
  }

  /**
   * Retrieve a list of all users.
   * @returns A list of users or an error response if not found.
   */
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users.',
  })
  @ApiOkResponse({
    type: OkArrayResponseDto,
    description: 'Successfully retrieved the list of users.',
  })
  @ApiNotFoundResponse({
    type: NotFoundGetAllDto,
    description: 'No users found. The user database is empty.',
  })
  async getAll(): Promise<OkArrayResponseDto | NotFoundGetAllDto> {
    return await this.usersCrudService.getAll();
  }

  /**
   * Update user information based on the provided data.
   * @param userId - The ID of the user to update.
   * @param updateUserDto - Data for updating the user.
   * @returns A response indicating success or failure.
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Update user by id',
    description:
      'This endpoint is used to update a user by their unique identifier (ID).',
  })
  @ApiParam({
    name: 'id',
    description: 'User IDThe unique identifier (ID) of the user',
    type: Number,
  })
  @ApiBody({
    type: UpdateUserBodyDto,
    description:
      'Request body for updating a user. Include the fields you want to update.',
  })
  @ApiOkResponse({
    type: OkResponseUpdateUserDto,
    description:
      'Successful response after updating a user. It includes details of the updated user.',
  })
  @ApiNotFoundResponse({
    type: NotFoundUpdateUserDto,
    description:
      'User with the provided ID not found. Please make sure the ID is valid.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserBodyDto: UpdateUserBodyDto,
  ): Promise<OkResponseUpdateUserDto | NotFoundUpdateUserDto> {
    return await this.usersCrudService.update(id, updateUserBodyDto);
  }

  /**
   * Delete a user based on their ID.
   * @param userId - The ID of the user to delete.
   * @returns A response indicating success or failure.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user by id',
    description:
      'This endpoint is used to delete a user by their unique identifier (ID).',
  })
  @ApiParam({
    name: 'id',
    description: 'Id of the user to be deleted',
    type: Number,
  })
  @ApiOkResponse({
    type: OkResponseDeleteUserDto,
    description: 'User successfully deleted.',
  })
  @ApiNotFoundResponse({
    type: NotFoundDeleteUserDto,
    description: 'User not found.',
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OkResponseDeleteUserDto | NotFoundDeleteUserDto> {
    return await this.usersCrudService.delete(id);
  }

  // *************************************
  // Change password operation
  // *************************************

  /**
   * Change user password by identifier (ID).
   * @param id - User identifier.
   * @param changePasswordBodyDto - Request body for changing user password.
   * @returns A response indicating success or failure.
   */
  @Patch('change-password/:id')
  @ApiOperation({
    summary: 'Change user password',
    description:
      'This endpoint is used to change user password by identifier (ID).',
  })
  @ApiParam({ name: 'id', description: 'User identifier', type: Number })
  @ApiBody({
    type: ChangePasswordBodyDto,
    description: 'Request body for changing user password.',
  })
  @ApiOkResponse({
    type: OkResponseChangePasswordDto,
    description: 'User password has been successfully changed.',
  })
  @ApiNotFoundResponse({
    type: NotFoundChangePasswordDto,
    description: 'User not found.',
  })
  @ApiBadRequestResponse({
    type: BadRequestChangePasswordDto,
    description:
      'Malformed request. Possible reasons: incorrect current password or mismatch between new passwords.',
  })
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordBodyDto: ChangePasswordBodyDto,
  ): Promise<
    | OkResponseChangePasswordDto
    | BadRequestChangePasswordDto
    | NotFoundChangePasswordDto
  > {
    return await this.usersActionsService.changePassword(
      id,
      changePasswordBodyDto,
    );
  }
}
