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
     ValidationPipe,
     UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { User, UserCreateInput, UserUpdateInput } from '@/shared/interfaces/user.interface';
import { ResponseInterceptor } from '@/shared/interceptors/response.interceptor';
import { UsersService } from '@/modules/users/users.service';
import { FindUserDto } from '@/modules/users/dtos/find-user.dto';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { getUser } from '@/shared/decorators/req-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ResponseInterceptor)
export class UsersController {
     constructor(private readonly usersService: UsersService) {}

     @Post('new')
     @ApiOperation({ summary: 'create a new user' })
     async create(@Body() user: UserCreateInput): Promise<User> {
          return this.usersService.create(user);
     }

     @Get('all')
     @ApiOperation({ summary: 'retrieve a list of users' })
     @UsePipes(new ValidationPipe({ transform: true }))
     async find(@Query() query: FindUserDto): Promise<User[]> {
          const params = {
               skip: query.skip,
               take: query.take,
               where: query.where,
               orderBy: query.orderBy,
          };

          return this.usersService.find(params);
     }

     @Get('/profile')
     @UseGuards(JwtAuthGuard)
     @ApiOperation({ summary: 'retrieve the current user profile' })
     async findOwnProfile(@getUser() user: User) {
          return this.usersService.findById(user.id);
     }

     @Get('single/:id')
     @ApiOperation({ summary: 'retrieve a user by ID' })
     async findById(@Param('id') id: string): Promise<User> {
          return this.usersService.findById(id);
     }

     @Get('single/email/:email')
     @ApiOperation({ summary: 'retrieve a user by email' })
     async findByEmail(@Param('email') email: string): Promise<User> {
          return this.usersService.findByEmail(email);
     }

     @Get('single/username/:username')
     @ApiOperation({ summary: 'retrieve a user by username' })
     async findByUsername(@Param('username') username: string): Promise<User> {
          return this.usersService.findByUsername(username);
     }

     @Put('profile/edit')
     @UseGuards(JwtAuthGuard)
     @ApiOperation({ summary: 'update user information' })
     async update(
          @getUser() user: User,
          @Body() data: UserUpdateInput,
     ): Promise<User> {
          return this.usersService.update(user.id, data);
     }

     @Put('role/:id')
     @ApiOperation({ summary: 'update user role' })
     async updateByRole(
          @Param('id') id: string,
          @Body('role') role: 'ADMIN' | 'USER' | 'MODERATOR',
     ): Promise<User> {
          return this.usersService.updateByRole(id, role);
     }

     @Put('block/:id')
     @ApiOperation({ summary: 'block a user' })
     async block(@Param('id') id: string): Promise<User> {
          return this.usersService.block(id);
     }

     @Put('unblock/:id')
     @ApiOperation({ summary: 'unblock a user' })
     async unBlock(@Param('id') id: string): Promise<User> {
          return this.usersService.unBlock(id);
     }

     @Delete('remove/:id')
     @ApiOperation({ summary: 'delete a user' })
     async delete(@Param('id') id: string): Promise<User> {
          return this.usersService.delete(id);
     }
}
