import {
     Controller,
     UseInterceptors,
     Post,
     Get,
     Put,
     Delete,
     Param,
     Body,
     Query,
     Req,
     UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { User, UserCreateInput, UserUpdateInput } from '@/shared/interfaces/user.interface';
import { ResponseInterceptor } from '@/shared/interceptors/response.interceptor';
import { UsersService } from '@/modules/users/users.service';
import { FindUserDto } from '@/modules/users/dtos/find-user.dto';
import { Request } from 'express';
import { IJwtPayload } from '@/shared/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';

interface IAuthenticationRequest extends Request {
     user: IJwtPayload;
}

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ResponseInterceptor)
export class UsersController {
     constructor(private readonly usersService: UsersService) {}

     @Post('new')
     @ApiOperation({ summary: 'Create a new user' })
     @ApiResponse({ status: 201, description: 'User successfully created.' })
     @ApiResponse({ status: 400, description: 'Invalid data.' })
     async create(@Body() user: UserCreateInput): Promise<User> {
          return this.usersService.create(user);
     }

     @Get('all')
     @ApiOperation({ summary: 'Retrieve a list of users' })
     @ApiResponse({ status: 200, description: 'List of users.' })
     @ApiResponse({ status: 404, description: 'Users not found.' })
     @ApiQuery({ name: 'params', required: false, type: FindUserDto })
     async find(
          @Query('skip') skip: string,
          @Query('take') take: string,
          @Query('where') where: string,
          @Query('orderBy') orderBy: string,
     ): Promise<User[]> {
          const params = {
               skip: skip ? parseInt(skip, 10) : undefined,
               take: take ? parseInt(take, 10) : undefined,
               where: where ? JSON.parse(where) : undefined,
               orderBy: orderBy ? JSON.parse(orderBy) : undefined,
          };

          return this.usersService.find(params);
     }

     @Get('/profile')
     @UseGuards(JwtAuthGuard)
     @ApiOperation({ summary: 'Retrieve the current user profile' })
     @ApiResponse({ status: 200, description: 'User profile.' })
     @ApiResponse({ status: 401, description: 'Unauthorized.' })
     async findOwnProfile(@Req() req: IAuthenticationRequest) {
          return this.usersService.findById(req.user.sub);
     }

     @Get('single/:id')
     @ApiOperation({ summary: 'Retrieve a user by ID' })
     @ApiResponse({ status: 200, description: 'User found.' })
     @ApiResponse({ status: 404, description: 'User not found.' })
     @ApiParam({ name: 'id', required: true, description: 'User ID' })
     async findById(@Param('id') id: string): Promise<User> {
          return this.usersService.findById(id);
     }

     @Get('single/email/:email')
     @ApiOperation({ summary: 'Retrieve a user by email' })
     @ApiResponse({ status: 200, description: 'User found.' })
     @ApiResponse({ status: 404, description: 'User not found.' })
     @ApiParam({ name: 'email', required: true, description: 'User email' })
     async findByEmail(@Param('email') email: string): Promise<User> {
          return this.usersService.findByEmail(email);
     }

     @Get('single/username/:username')
     @ApiOperation({ summary: 'Retrieve a user by username' })
     @ApiResponse({ status: 200, description: 'User found.' })
     @ApiResponse({ status: 404, description: 'User not found.' })
     @ApiParam({ name: 'username', required: true, description: 'Username' })
     async findByUsername(@Param('username') username: string): Promise<User> {
          return this.usersService.findByUsername(username);
     }

     @Put('profile/edit')
     @UseGuards(JwtAuthGuard)
     @ApiOperation({ summary: 'Update user information' })
     @ApiResponse({ status: 200, description: 'User successfully updated.' })
     @ApiResponse({ status: 404, description: 'User not found.' })
     @ApiParam({ name: 'id', required: true, description: 'User ID' })
     async update(@Req() req: IAuthenticationRequest, @Body() data: UserUpdateInput): Promise<User> {
          return this.usersService.update(req.user.sub, data);
     }

     @Put('role/:id')
     @ApiOperation({ summary: 'Update user role' })
     @ApiResponse({ status: 200, description: 'User role successfully updated.' })
     @ApiResponse({ status: 404, description: 'User not found.' })
     @ApiParam({ name: 'id', required: true, description: 'User ID' })
     async updateByRole(
          @Param('id') id: string,
          @Body('role') role: 'ADMIN' | 'USER' | 'MODERATOR',
     ): Promise<User> {
          return this.usersService.updateByRole(id, role);
     }

     @Put('block/:id')
     @ApiOperation({ summary: 'Block a user' })
     @ApiResponse({ status: 200, description: 'User successfully blocked.' })
     @ApiResponse({ status: 404, description: 'User not found.' })
     @ApiParam({ name: 'id', required: true, description: 'User ID' })
     async block(@Param('id') id: string): Promise<User> {
          return this.usersService.block(id);
     }

     @Put('unblock/:id')
     @ApiOperation({ summary: 'Unblock a user' })
     @ApiResponse({ status: 200, description: 'User successfully unblocked.' })
     @ApiResponse({ status: 404, description: 'User not found.' })
     @ApiParam({ name: 'id', required: true, description: 'User ID' })
     async unBlock(@Param('id') id: string): Promise<User> {
          return this.usersService.unBlock(id);
     }

     @Delete('remove/:id')
     @ApiOperation({ summary: 'Delete a user' })
     @ApiResponse({ status: 200, description: 'User successfully deleted.' })
     @ApiResponse({ status: 404, description: 'User not found.' })
     @ApiParam({ name: 'id', required: true, description: 'User ID' })
     async delete(@Param('id') id: string): Promise<User> {
          return this.usersService.delete(id);
     }
}
