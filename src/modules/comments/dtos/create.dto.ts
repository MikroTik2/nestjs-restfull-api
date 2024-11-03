import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentCreateDto {
     @IsString()
     @ApiProperty({
          type: String,
          required: true,
          name: 'text',
          description: 'content of comment',
          default: 'Nice',
     })
     text: string;

     @IsNumber()
     @ApiProperty({ name: 'postId', required: true, type: Number })
     postId: string;

     @IsNumber()
     @IsOptional()
     @ApiProperty({
          type: Number,
          required: false,
          name: 'replyId',
          description: 'reply to a comment',
     })
     replyId?: string;
}
