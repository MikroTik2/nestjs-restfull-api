import { ResponseInterceptor } from '@/shared/interceptors/response.interceptor';
import { Post, UseInterceptors, Controller, Body, UseGuards, Req, Get, Query, Delete, Put, Param } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '@/modules/posts/dtos/create.dto';
import { PostsService } from '@/modules/posts/posts.service';
import { IJwtPayload } from '@/shared/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';

import { SearchPostDto } from '@/modules/posts/dtos/search.dto';
import { UpdatePostDto } from '@/modules/posts/dtos/update.dto';

interface IAuthenticationRequest extends Request {
     user: IJwtPayload;
}

@ApiTags('Posts')
@Controller('posts')
@UseInterceptors(ResponseInterceptor)
export class PostsController {
     constructor(
          private readonly postsService: PostsService,
     ) {};

     @Post('new')
     @UseGuards(JwtAuthGuard)
     createPost(@Req() req: IAuthenticationRequest, @Body() createPostDto: CreatePostDto) {
          return this.postsService.create(req.user.sub, createPostDto);
     };

     @ApiOperation({ summary: "get public Posts",})
     @ApiQuery({ name: "title", required: false })
     @ApiQuery({ name: "content", required: false })
     @ApiQuery({ name: "page", required: false })
     @ApiQuery({ name: "limit", required: false })
     @Get('all')
     async getPublicPosts(@Query() query: SearchPostDto) {
          return this.postsService.getPublicPosts(query);
     }

     @Get('single/:id')
     async getSinglePost(@Param('id') id: string) {
          return this.postsService.singlePost(id);
     };

     @Put('edit/:id')
     @UseGuards(JwtAuthGuard)
     async updatePost(@Param('id') id: string, @Req() req: IAuthenticationRequest, @Body() updatePostData: UpdatePostDto) {
          return this.postsService.update(req.user.sub, id, updatePostData);
     };

     @Delete('delete/:id')
     @UseGuards(JwtAuthGuard)
     async deletePost(@Param('id') id: string, @Req() req: IAuthenticationRequest) {
          return this.postsService.delete(req.user.sub, id);
     };
};