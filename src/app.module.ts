import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { UsersModule } from '@/modules/users/users.module';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { AuthenticationModule } from '@/modules/authentication/authentication.module';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { PostsModule } from '@/modules/posts/posts.module';
import { CommentsModule } from '@/modules/comments/comments.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import configs from '@/shared/config/index';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
     imports: [
          PostsModule,
          PrismaModule,
          UsersModule,
          CategoriesModule,
          AuthenticationModule,
          CommentsModule,

          ConfigModule.forRoot({
               isGlobal: true,
               load: [...configs],
          }),

          ThrottlerModule.forRoot([
               {
                    ttl: 60000,
                    limit: 10,
               },
          ]),

          GraphQLModule.forRoot<ApolloDriverConfig>({
               driver: ApolloDriver,
               autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
               sortSchema: true,
               playground: true,
               introspection: true,
               formatError: (error) => {
                    const graphQLFormattedError = {
                         // @ts-ignore
                         message: error.extensions?.exception?.response?.message || error.message,
                         code: error.extensions?.code || 'SERVER_ERROR',
                         // @ts-ignore
                         name: error.extensions?.exception?.name || error.name,
                    };

                    return graphQLFormattedError;
               },
               context: ({ req, res }) => ({ req, res }),
          }),
     ],
})
export class AppModule {}
