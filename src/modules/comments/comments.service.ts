import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { User } from '../../shared/interfaces/user.interface';
import { CommentCreateDto } from './dtos/create.dto';
import { PostsRepository } from '@/modules/posts/posts.repository';
import { CommentWithChilds, CommentWithRelation } from '../../shared/interfaces/comment.interface';
import { Role } from '../../shared/interfaces/role.interface';
import { QueryDto } from './dtos/query.dto';

@Injectable()
export class CommentsService {
     constructor(
          private commentsRepository: CommentsRepository,
          private postsRepository: PostsRepository,
     ) {}

     async getAll(query: QueryDto, user: User | null) {
          try {
               const postId: string = query.postId;
               const page: number = Number(query.page) || 1;
               let limit: number = Number(query.limit) || 10;
               let dbQuery: any = {};

               if (limit > 10) limit = 10;
               if (!postId) {
                    if (user && user.role != 'ADMIN') return [];
                    return await this.commentsRepository.find(page, limit);
               }

               const comments: CommentWithRelation[] = await this.commentsRepository.findByPostId(
                    postId,
                    page,
                    limit,
               );
               return comments;
          } catch (e) {
               throw e;
          }
     }

     async create(data: CommentCreateDto, user: User) {
          try {
               const postId: string = data.postId;

               const hasPost = await this.postsRepository.findById(postId);
               if (!hasPost || !hasPost.published) throw new NotFoundException('POST_NOT_EXIST');

               const replyId: string | null = data.replyId;
               if (replyId) {
                    const hasComment: CommentWithChilds | null =
                         await this.commentsRepository.getById(replyId);

                    if (!hasComment || hasComment.postId != hasPost.id)
                         throw new NotFoundException('REPLY_COMMENT_NOT_FOUND');
               }

               const comment = await this.commentsRepository.create({
                    postId,
                    replyId,
                    text: data.text,
                    authorId: user.id,
               });

               return comment.id;
          } catch (e) {
               throw e;
          }
     }

     async delete(commentId: string, user: User) {
          try {
               const comment: CommentWithChilds | null = await this.commentsRepository.getById(
                    commentId,
               );

               if (!comment) throw new NotFoundException('NOT_FOUND');

               if (comment.authorId != user.id && !user.role.includes(Role.ADMIN)) {
                    throw new ForbiddenException('PERMISSION_DENIED');
               }

               await this.commentsRepository.deleteOne(comment.id);

               return {};
          } catch (e) {
               throw e;
          }
     }
}
