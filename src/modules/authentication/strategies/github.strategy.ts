import {
     UseInterceptors,
     Injectable,
     NotFoundException,
     UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { HttpService } from '@nestjs/axios';
import { Profile, Strategy } from 'passport-github';

import { IAppConfiguration } from '@/shared/config/app.config';
import { AuthenticationService } from '@/modules/authentication/authentication.service';
import { UsersService } from '@/modules/users/users.service';
import { MailService } from '@/modules/mail/mail.service';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';
import { catchError, map } from 'rxjs';

import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
     constructor(
          private readonly http: HttpService,
          private readonly mail: MailService,
          private readonly cloudinary: CloudinaryService,
          private readonly config: ConfigService<IAppConfiguration>,
          private readonly usersService: UsersService,
          private readonly authService: AuthenticationService,
     ) {
          super({
               clientID: config.get('GITHUB_CLIENT_ID'),
               clientSecret: config.get('GITHUB_CLIENT_SECRET'),
               callbackURL: config.get('GITHUB_CALLBACK_URL'),
               scope: ['user', 'user:email'],
          });
     }

     async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
          const { username, provider, id, photos } = profile;

          const request = await this.http
               .get('https://api.github.com/user/emails', {
                    headers: {
                         Authorization: `token ${_accessToken}`,
                    },
               })
               .pipe(
                    map((response) => response.data),
                    catchError((error) => {
                         throw new UnauthorizedException('Github authentication failed: ' + error);
                    }),
               )
               .toPromise();

          const userData = {
               username,
               provider,
               email: request[0].email,
               github_id: id,
          };

          const avatar = await this.cloudinary.uploadImage(photos[0].value);
          const password = crypto.randomBytes(25).toString('hex');

          let user = await this.usersService.findByProviderId(provider, userData.email, id);

          if (!user) {
               user = await this.usersService.create({
                    ...userData,
                    password: await bcrypt.hash(password, 10),
                    avatar: {
                         public_id: avatar.public_id,
                         url: avatar.url,
                    },
               });
          }

          if (user.provider === 'google') {
               await this.usersService.update(user.id, {
                    provider: 'github',
                    github_id: userData.github_id,
               });
          }

          await this.mail.onSendWelcome(user);

          const token = this.authService.generateJWTToken(user);
          return { user, token };
     }
}
