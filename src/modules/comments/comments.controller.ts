import {
     Body,
     Controller,
     Delete,
     Get,
     Param,
     Post,
     Query,
     UseGuards,
     UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommentCreateDto } from './dtos/create.dto';
import { CommentsService } from './comments.service';
import { User } from '../../shared/interfaces/user.interface';
import { ResponseInterceptor } from '../../shared/interceptors/response.interceptor';
import { QueryDto } from './dtos/query.dto';
import { getUser } from '@/shared/decorators/req-user.decorator';

@ApiTags('Comments')
@Controller('comments')
@UseInterceptors(ResponseInterceptor)
export class CommentsController {
     constructor(private commentsService: CommentsService) {}

     @Get('all')
     @ApiOperation({ summary: 'get comments' })
     getAll(@Query() query: QueryDto, @getUser() user: User) {
          return this.commentsService.getAll(query, user);
     }

     @ApiOperation({
          summary: 'create a comment',
          description: 'only Users',
     })
     @Post()
     async create(@Body() data: CommentCreateDto, @getUser() user: User) {
          return this.commentsService.create(data, user);
     }

     @ApiOperation({
          summary: 'delete comment by commentId',
     })
     @Delete('delete/:id')
     async delete(@Param('id') commentId: string, @getUser() user: User) {
          return this.commentsService.delete(commentId, user);
     }
}
