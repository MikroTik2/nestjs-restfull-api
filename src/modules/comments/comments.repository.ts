import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
     Comment,
     CommentCreateInput,
     CommentWithChilds,
     CommentWithRelation,
} from '@/shared/interfaces/comment.interface';
import { BatchPayload } from '@/shared/interfaces/repository.interface';

@Injectable()
export class CommentsRepository {
     constructor(private db: PrismaService) {}

     async create(input: CommentCreateInput) {
          return this.db.comment.create({ data: input });
     }

     async getById(id: string): Promise<CommentWithChilds | null> {
          return this.db.comment.findUnique({
               where: { id },
               include: { childs: true },
          });
     }

     async deleteOne(id: string): Promise<Comment> {
          return this.db.comment.delete({
               where: {
                    id,
               },
          });
     }

     async deleteCommentsByPostId(postId: string): Promise<BatchPayload> {
          return this.db.comment.deleteMany({
               where: { postId },
          });
     }

     async findByPostId(
          postId: string,
          page: number,
          limit: number,
     ): Promise<CommentWithRelation[]> {
          return this.db.comment.findMany({
               where: {
                    postId: postId,
               },
               include: {
                    childs: true,
                    author: {
                         select: {
                              username: true,
                              id: true,
                         },
                    },
               },
               take: limit,
               skip: (page - 1) * limit,
          });
     }

     async find(page: number, limit: number): Promise<CommentWithRelation[]> {
          return this.db.comment.findMany({
               take: limit,
               skip: (page - 1) * limit,
               include: {
                    childs: true,
                    author: {
                         select: {
                              username: true,
                              id: true,
                         },
                    },
               },
          });
     }
}
