import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from '@/modules/authentication/authentication.controller';
import { AuthenticationService } from '@/modules/authentication/authentication.service';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { UsersModule } from '@/modules/users/users.module';
import { MailModule } from '@/modules/mail/mail.module';
import { GithubOauthGuard } from '@/shared/guards/github-auth.guard';
import { GithubStrategy } from '@/modules/authentication/strategies/github.strategy';
import { CloudinaryModule } from '@/modules/cloudinary/cloudinary.module';
import { HttpModule } from '@nestjs/axios';
import { GoogleOauthGuard } from '@/shared/guards/google-auth.guard';
import { GoogleStrategy } from '@/modules/authentication/strategies/google.strategy';

@Module({
     imports: [
          JwtModule.register({
               secret: process.env.JWT_SECRET_KEY,
               signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
          }),

          MailModule,
          CloudinaryModule,
          HttpModule,
          UsersModule,
     ],

     controllers: [AuthenticationController],
     providers: [
          AuthenticationService,
          GithubStrategy,
          GoogleStrategy,
          GoogleOauthGuard,
          GithubOauthGuard,
          JwtAuthGuard,
     ],
     exports: [AuthenticationService],
})
export class AuthenticationModule {}
