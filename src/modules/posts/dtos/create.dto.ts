import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
     ArrayMaxSize,
     ArrayMinSize,
     IsArray,
     IsBoolean,
     IsNotEmpty,
     IsOptional,
     IsString,
     ValidateNested,
} from 'class-validator';

export class Image {
     @ApiProperty({ example: 'sample', description: 'Public ID of the image' })
     public_id: string;

     @ApiProperty({ example: 'https://cloudinary.com/sample.png', description: 'URL of the image' })
     url: string;
}

export class CreatePostDto {
     @IsString()
     @IsNotEmpty()
     @ApiProperty({ description: 'Title of the post', example: 'My first post', required: true })
     title: string;

     @IsString()
     @IsNotEmpty()
     @ApiProperty({
          description: 'Content of the post',
          example: 'This is my first post',
          required: true,
     })
     content: string;

     @ApiProperty({
          description: 'Images of the post',
          example: [{ public_id: 'sample', url: 'https://cloudinary.com/sample.png' }],
          required: false,
          type: () => [Image],
     })
     @IsOptional()
     @ValidateNested({ each: true })
     @Type(() => Image)
     images: Image[];

     @ApiProperty({ description: 'Published of the post', example: true, required: true })
     @IsBoolean()
     published: boolean;

     @ApiProperty({
          description: 'category of the post',
          example: [1],
          required: true,
          maxItems: 3,
          minItems: 1,
     })
     @ArrayMinSize(1)
     @ArrayMaxSize(3)
     @IsArray()
     categories: string[];

     @ApiProperty({ description: 'Tags of the post', example: ['tag1', 'tag2'], required: true })
     tags: string[];
}
