import { Field, ObjectType, ID } from '@nestjs/graphql';
import { authorModel } from '@/modules/posts/models/author.model';
import { Post } from '@/shared/interfaces/post.interface';

@ObjectType()
export class ImageModel {
    @Field((type) => String)
    public_id: string;

    @Field((type) => String)
    url: string;
}

@ObjectType({
     description: 'Post model',
})
export class postModel implements Post {
     @Field((type) => ID)
     id: string;

     @Field((type) => String)
     title: string;

     @Field((type) => String)
     content: string;

     @Field((type) => String)
     authorId: string;

     @Field((type) => authorModel)
     author: authorModel;

     @Field((type) => Boolean)
     published: boolean;

     @Field((type) => [ImageModel], { nullable: true })
     images: ImageModel[];

     @Field((type) => String)
     likes: string[];

     @Field((type) => Date)
     createdAt: Date;

     @Field((type) => Date)
     updatedAt: Date;

     @Field((type) => String)
     tags: string;
}
