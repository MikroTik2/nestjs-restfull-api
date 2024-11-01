import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@/shared/interfaces/user.interface';

@ObjectType({
     description: 'User model',
})
export class authorModel
     implements
          Omit<
               User,
               | 'lastname'
               | 'firstname'
               | 'mobile'
               | 'email'
               | 'password'
               | 'provider'
               | 'google_id'
               | 'github_id'
               | 'blocked'
               | 'avatar'
               | 'role'
               | 'reset_password_token'
               | 'reset_password_expire'
               | 'comments'
               | 'posts'
          >
{
     @Field((type) => String)
     id: string;

     @Field((type) => String)
     username: string;

     @Field((type) => Date)
     createdAt: Date;

     @Field((type) => Date)
     updatedAt: Date;
}
