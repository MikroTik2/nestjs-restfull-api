import { Module } from '@nestjs/common';
import { LoggingModule } from '@/modules/logging/logging.module';
import { ConsoleLogger } from '@/modules/logging/loggers/console.logger';
import { PostResolver } from '@/modules/posts/posts.resolver';
import { PostsRepository } from '@/modules/posts/posts.repository';
import { PostsController } from '@/modules/posts/posts.controller';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { PostsService } from '@/modules/posts/posts.service';
import { CloudinaryModule } from '@/modules/cloudinary/cloudinary.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Module({
     imports: [CategoriesModule, CloudinaryModule, LoggingModule.register(new ConsoleLogger())],
     controllers: [PostsController],
     providers: [PostsService, PrismaService, PostsRepository, JwtService, PostResolver],
     exports: [PostsRepository],
})
export class PostsModule {}
