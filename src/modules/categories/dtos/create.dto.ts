import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
     @IsString()
     @IsNotEmpty()
     @ApiProperty({
          type: String,
          description: 'The name of the category',
          example: 'Electronics',
          required: true,
     })
     name: string;
}
