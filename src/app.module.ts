import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { UsersModule } from '@/modules/users/users.module';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { AuthenticationModule } from '@/modules/authentication/authentication.module';

import configs from '@/shared/config/index';

@Module({
     imports: [
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

          PrismaModule,
          UsersModule,
          AuthenticationModule,
     ],
})
export class AppModule {}
