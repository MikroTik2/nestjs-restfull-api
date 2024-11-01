import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { UsersModule } from '@/modules/users/users.module';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { AuthenticationModule } from '@/modules/authentication/authentication.module';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { PostsModule } from '@/modules/posts/posts.module';
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

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
               playground: false,
          }),
     ],
})
export class AppModule {}
