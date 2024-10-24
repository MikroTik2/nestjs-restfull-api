import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { MailService } from '@/modules/mail/mail.service';
import { AuthenticationService } from '../authentication.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/modules/users/users.service';
import { IAppConfiguration } from '@/shared/config/app.config';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
     constructor(
          private readonly mail: MailService,
          private readonly authService: AuthenticationService,
          private readonly config: ConfigService<IAppConfiguration>,
          private readonly cloudinary: CloudinaryService,
          private readonly usersService: UsersService,
     ) {
          super({
               clientID: config.get('GOOGLE_CLIENT_ID'),
               clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
               callbackURL: config.get('GOOGLE_CLIENT_URL'),
               scope: ['profile', 'email'],
          });
     }

     async validate(
          _accessToken: string,
          _refreshToken: string,
          profile: any,
          done: VerifyCallback,
     ) {
          const { id, name, emails, photos } = profile;

          const avatar = await this.cloudinary.uploadImage(photos[0].value);
          const password = crypto.randomBytes(25).toString('hex');

          let user = await this.usersService.findByProviderId('google', emails[0].value, id);

          if (!user) {
               user = await this.usersService.create({
                    provider: 'google',
                    google_id: id,
                    email: emails[0].value,
                    username: `${name.givenName} ${name.familyName}`,
                    password: await bcrypt.hash(password, 10),
                    avatar: {
                         public_id: avatar.public_id,
                         url: avatar.url,
                    },
               });
          }

          if (user.provider === 'github') {
               await this.usersService.update(user.id, {
                    provider: 'google',
                    google_id: id,
               });
          }

          await this.mail.onSendWelcome(user);

          const token = this.authService.generateJWTToken(user);
          done(null, { user, token });
     }
}
