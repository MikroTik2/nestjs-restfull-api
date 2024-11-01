import { SearchPostDto } from '@/modules/posts/dtos/search.dto';
import { postModel } from '@/modules/posts/models/post.model';
import { PostsRepository } from '@/modules/posts/posts.repository';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Post } from '@/shared/interfaces/post.interface';

import { LoggingService } from '@/modules/logging/logging.service';

@Resolver()
export class PostResolver {
     constructor(
          private readonly postsRepository: PostsRepository,
          private readonly loggingService: LoggingService,
     ) {}

     @Query((returns) => [postModel])
     async all(
          @Args('page', { nullable: false }) page: number,
          @Args('limit', { nullable: false }) limit: number,
          @Args() args: SearchPostDto,
     ) {
          try {


               const query = {
                    title: {
                      contains: args.title,
                    },
                    content: {
                      contains: args.content,
                    },
               };

               return this.postsRepository.find(page, limit, query);

          } catch (error: any) {
               this.loggingService.error(error.message, error.stack);
               throw error;
          }
     }

     @Query((returns) => postModel)
     async findById(@Args('postId', { nullable: false, type: () => String }) postId: string) {
          const post: Post = await this.postsRepository.findById(postId);
          return post;
     }
}
