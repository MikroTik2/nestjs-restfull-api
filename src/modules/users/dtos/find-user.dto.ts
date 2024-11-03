import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';

export class FindUserDto {
     @ApiProperty({ required: false, type: Number, example: 2 })
     @Type(() => Number)
     skip?: number;

     @ApiProperty({ required: false, type: Number, example: 6 })
     @Type(() => Number)
     take?: number;

     @ApiProperty({ required: false, type: 'object' })
     cursor?: Prisma.UserWhereUniqueInput;

     @ApiProperty({ required: false, type: 'object' })
     where?: Prisma.UserWhereInput;

     @ApiProperty({ required: false, type: 'object' })
     orderBy?: Prisma.UserOrderByWithRelationInput;
}
