import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
     @ApiProperty({
          description: 'The email of the user',
          required: true,
          type: String,
          example: 'artur0077@gmail.com',
          uniqueItems: true,
     })
     @IsString()
     @IsNotEmpty()
     @IsEmail()
     email: string;

     @ApiProperty({
          description: 'The password of the user',
          required: true,
          type: String,
          example: 'DLFKGO43034',
     })
     @IsString()
     @IsNotEmpty()
     password: string;
}
