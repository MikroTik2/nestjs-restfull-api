import { forwardRef, Module } from '@nestjs/common';
import { CommentsRepository } from '@/modules/comments/comments.repository';
import { CommentsController } from '@/modules/comments/comments.controller';
import { CommentsService } from '@/modules/comments/comments.service';
import { PostsModule } from '@/modules/posts/posts.module';
import { PrismaModule } from '@/modules/prisma/prisma.module';

const providersAndExports = [CommentsRepository];
@Module({
     imports: [forwardRef(() => PostsModule), PrismaModule],
     controllers: [CommentsController],
     providers: [...providersAndExports, CommentsService],
     exports: [...providersAndExports],
})
export class CommentsModule {}
