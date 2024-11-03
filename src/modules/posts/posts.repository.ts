import { Injectable } from '@nestjs/common';
import { Post, PostCreateInput, PostUpdateInput } from '@/shared/interfaces/post.interface';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class PostsRepository {
     constructor(private readonly prisma: PrismaService) {}

     async create(post: PostCreateInput): Promise<Post> {
          return this.prisma.post.create({ data: post });
     }

     async find(page: number, limit: number, query: any): Promise<Post[]> {
          return this.prisma.post.findMany({
               where: {
                    ...query,
                    published: true,
               },
               take: limit,
               skip: (page - 1) * limit,
               orderBy: {
                    createdAt: 'desc',
               },
               include: {
                    author: {
                         select: {
                              id: true,
                              username: true,
                              createdAt: true,
                              updatedAt: true,
                         },
                    },
                    categories: {
                         select: {
                              postId: false,
                              categoryId: false,
                              assignedAt: false,
                              category: {
                                   select: {
                                        id: true,
                                        name: true,
                                        slug: true,
                                   },
                              },
                         },
                    },
               },
          });
     }

     async findById(id: string): Promise<Post> {
          return this.prisma.post.findUnique({
               where: {
                    id: id,
               },
               include: {
                    author: {
                         select: {
                              id: true,
                              username: true,
                              createdAt: true,
                              role: true,
                         },
                    },
                    categories: {
                         select: {
                              postId: false,
                              categoryId: false,
                              assignedAt: false,
                              category: {
                                   select: {
                                        id: true,
                                        name: true,
                                        slug: true,
                                   },
                              },
                         },
                    },
               },
          });
     }

     async findByPublicCount(query: any): Promise<number> {
          return this.prisma.post.count({ where: { ...query, published: true } });
     }

     async update(id: string, data: PostUpdateInput): Promise<Post> {
          return this.prisma.post.update({
               where: { id },
               data,
          });
     }

     async delete(id: string): Promise<Post> {
          return this.prisma.post.delete({
               where: { id },
          });
     }
}
