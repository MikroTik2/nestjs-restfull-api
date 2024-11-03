import { ResponseInterceptor } from '@/shared/interceptors/response.interceptor';
import {
     Post,
     UseInterceptors,
     Controller,
     Body,
     UseGuards,
     Get,
     Query,
     Delete,
     Put,
     Param,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '@/modules/posts/dtos/create.dto';
import { PostsService } from '@/modules/posts/posts.service';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';

import { SearchPostDto } from '@/modules/posts/dtos/search.dto';
import { UpdatePostDto } from '@/modules/posts/dtos/update.dto';
import { getUser } from '@/shared/decorators/req-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Posts')
@Controller('posts')
@UseInterceptors(ResponseInterceptor)
export class PostsController {
     constructor(private readonly postsService: PostsService) {}

     @Post('new')
     @UseGuards(JwtAuthGuard)
     @ApiOperation({ summary: 'create a new post' })
     createPost(@getUser() user: User, @Body() createPostDto: CreatePostDto) {
          return this.postsService.create(user.id, createPostDto);
     }

     @Get('all')
     @ApiOperation({ summary: 'get public Posts' })
     async getPublicPosts(@Query() query: SearchPostDto) {
          return this.postsService.getPublicPosts(query);
     }

     @Get('single/:id')
     @ApiOperation({ summary: 'get a single post' })
     async getSinglePost(@Param('id') id: string) {
          return this.postsService.singlePost(id);
     }

     @Put('edit/:id')
     @UseGuards(JwtAuthGuard)
     @ApiOperation({ summary: 'update a post' })
     async updatePost(
          @Param('id') id: string,
          @getUser() user: User,
          @Body() updatePostData: UpdatePostDto,
     ) {
          return this.postsService.update(user.id, id, updatePostData);
     }

     @Put('likes/:id')
     @UseGuards(JwtAuthGuard)
     @ApiOperation({ summary: 'like a post' })
     async likePost(@Param('id') id: string, @getUser() user: User) {
          return this.postsService.likes(user.id, id);
     }

     @Delete('delete/:id')
     @UseGuards(JwtAuthGuard)
     @ApiOperation({ summary: 'delete a post' })
     async deletePost(@Param('id') id: string, @getUser() user: User) {
          return this.postsService.delete(user.id, id);
     }
}
