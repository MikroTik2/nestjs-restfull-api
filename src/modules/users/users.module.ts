import { Module } from '@nestjs/common';
import { UsersController } from '@/modules/users/users.controller';
import { UsersService } from '@/modules/users/users.service';
import { UsersRepository } from '@/modules/users/users.repository';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { JwtService } from '@nestjs/jwt';

@Module({
     imports: [PrismaModule, CloudinaryModule],
     controllers: [UsersController],
     providers: [UsersService, JwtService, UsersRepository],
     exports: [UsersService],
})
export class UsersModule {}
