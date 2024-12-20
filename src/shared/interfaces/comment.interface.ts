import { Comment as _Comment, Prisma } from '@prisma/client';

export interface Comment extends _Comment {}
export interface CommentCreateInput
     extends Omit<Prisma.CommentCreateInput, 'author' | 'post' | 'reply'> {
     replyId: string;
     authorId: string;
     postId: string;
}

export interface CommentWithChilds extends Comment {
     childs: Comment[];
}

export interface CommentWithRelation extends CommentWithChilds {
     author: {
          username: string;
          id: string;
     };
}
