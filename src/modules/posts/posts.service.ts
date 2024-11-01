import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '@/modules/posts/posts.repository';
import { CategoriesRepository } from '@/modules/categories/categories.repository';
import { LoggingService } from '@/modules/logging/logging.service';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';
import { Post, PostCreateInput, PostUpdateInput } from '@/shared/interfaces/post.interface';

import { CreatePostDto } from '@/modules/posts/dtos/create.dto';
import { UpdatePostDto } from '@/modules/posts/dtos/update.dto';
import { SearchPostDto } from '@/modules/posts/dtos/search.dto';
import { getCategoriesData } from '@/modules/posts/post.utility';

@Injectable()
export class PostsService {
     constructor(
          private readonly postsRepository: PostsRepository,
          private readonly categoriesRepository: CategoriesRepository,
          private readonly logger: LoggingService,
          private readonly cloudinary: CloudinaryService,
     ) {}

     async create(id: string, createPostDto: CreatePostDto) {
          try {
              const validate: boolean = await this.categoriesRepository.hasExistWithIds(createPostDto.categories);
              if (!validate) {
                  throw new BadRequestException('Categories not exist');
              }
      
              if (!Array.isArray(createPostDto.tags)) {
                  throw new BadRequestException('Tags invalid');
              }
      
              const tags = JSON.stringify(createPostDto.tags);
      
              const uploadImages = await Promise.all(
                  createPostDto.images.map(async (image) => {
                      const uploadedImage = await this.cloudinary.uploadImage(image.url);
                      return {
                          public_id: uploadedImage.public_id,
                          url: uploadedImage.secure_url,
                      };
                  }),
              );

              const postInput: PostCreateInput = {
                  ...createPostDto,
                  tags,
                  authorId: id,
                  images: uploadImages,
                  categories: {
                      create: getCategoriesData(createPostDto.categories),
                  },
              };
      
              const post = await this.postsRepository.create(postInput);
              return post;
      
          } catch (error: any) {
              this.logger.error(error.message, error.stack);
              throw error; 
          }
     }

     async getPublicPosts(search: SearchPostDto) {
          let query: any = {};

          if (search.title) query.title = { contains: search.title };
          if (search.content) query.content = { contains: search.content };

          const page: number = Number(search.page) || 1;
          let limit: number = Number(search.limit) || 10;

          if (limit > 10) limit = 10;

          try {
               const posts: Post[] = await this.postsRepository.find(page, limit, query);

               const total = await this.postsRepository.findByPublicCount(query);
               const pages = Math.ceil(total / limit);

               const hasNext = page < pages;
               const hasPrev = page > 1;
               const nextPage = page + 1;

               return {
                    posts,
                    total,
                    pages,
                    hasNext,
                    hasPrev,
                    nextPage,
               };
          } catch (error: any) {
               this.logger.error(error.message, error.stack);
               throw error;
          }
     }

     async singlePost(id: string) {
          try {
               const post: Post | null = await this.postsRepository.findById(id);
               if (!post || !post.published) throw new BadRequestException('Post not found');

               return post;
          } catch (error: any) {
               this.logger.error(error.message, error.stack);
               throw error;
          }
     }

     async update(userId: string, id: string, updatePostDto: UpdatePostDto) {
          try {
               const post: Post | null = await this.postsRepository.findById(id);
               if (!post)
                    throw new NotFoundException('Not found');
         
               try {
                 const valiadate = await this.categoriesRepository.hasExistWithIds(
                   updatePostDto.categories
                 );
                 if (!valiadate) throw new Error("catch");
               } catch (error) {
                 throw new BadRequestException('CATEGORIES_NOT_EXIST');
               }
         
               let tags: string;
               try {
                 if (Array.isArray(updatePostDto.tags))
                   tags = JSON.stringify(updatePostDto.tags);
                 else throw new Error("catch");
               } catch (error) {
                 throw new BadRequestException("TAGS_INVALID");
               }

               const uploadImages = await Promise.all(
                    updatePostDto.images.map(async (image) => {
                        const uploadedImage = await this.cloudinary.uploadImage(image.url);
                        return {
                            public_id: uploadedImage.public_id,
                            url: uploadedImage.secure_url,
                        };
                    }),
                );

               const data: PostUpdateInput = {
                    ...updatePostDto,
                    tags: JSON.stringify(tags),
                    authorId: userId,
                    categories: {
                    create: getCategoriesData(updatePostDto.categories),
                    },
                    images: uploadImages
               }

               await this.postsRepository.update(id, data);
               return {};
             } catch (error: any) {
               this.logger.error(error.message, error.stack);
               throw error;
             }
     };

     async delete(userId: string, id: string) {
          try {
               const post: Post | null = await this.postsRepository.findById(id);
               if (!post) throw new BadRequestException('Post not found');

               post.images.map(image => {
                    return this.cloudinary.destroyFile(image.public_id);
               })

               const deletePost: Post = await this.postsRepository.delete(id);

               return deletePost;
          } catch (error: any) {
               this.logger.error(error.message, error.stack);
               throw error;
          }
     }
}
