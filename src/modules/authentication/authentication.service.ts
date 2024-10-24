import {
     BadRequestException,
     Injectable,
     NotFoundException,
     UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/modules/users/users.service';
import { User } from '@prisma/client';

import { MailService } from '@/modules/mail/mail.service';

import { SignInDto } from '@/modules/authentication/dtos/signin.dto';
import { SignUpDto } from '@/modules/authentication/dtos/signup.dto';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export type _User = {
     user: User;
     token: string;
};

@Injectable()
export class AuthenticationService {
     constructor(
          private readonly usersService: UsersService,
          private readonly config: ConfigService,
          private readonly mail: MailService,
          private readonly jwt: JwtService,
     ) {}

     public generateJWTToken(user: User): string {
          const payload = { sub: user.id, email: user.email };
          return this.jwt.sign(payload);
     }

     async signup(userDto: SignUpDto): Promise<_User> {
          try {
               const userExists = await this.usersService.findOneByEmailAndUsername(
                    userDto.email,
                    userDto.username,
               );

               if (userExists) {
                    throw new BadRequestException('User already exists');
               }

               const user = await this.usersService.create({
                    ...userDto,
                    provider: 'local',
                    password: await bcrypt.hash(userDto.password, 10),
               });

               await this.mail.onSendWelcome(user);

               const token = this.generateJWTToken(user);

               return {
                    token,
                    user,
               };
          } catch (error) {
               throw error;
          }
     }

     async signin(userDto: SignInDto): Promise<_User> {
          try {
               const { email, password } = userDto;

               const user = await this.usersService.findByEmail(email);

               const isPasswordValid = await bcrypt.compare(password, user.password);
               if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

               const token = this.generateJWTToken(user);

               return {
                    user,
                    token,
               };
          } catch (error) {
               throw error;
          }
     }

     async forgotPassword(email: string): Promise<User> {
          const user = await this.usersService.findByEmail(email);
          if (!user) throw new NotFoundException(`User with email ${email} not found`);

          const generate_token = crypto.randomBytes(32).toString('hex');
          const reset_token = crypto.createHash('sha256').update(generate_token).digest('hex');

          user.reset_password_token = reset_token;
          user.reset_password_expire = new Date(Date.now() + 15 * 60 * 1000);

          await this.usersService.update(user.id, {
               reset_password_token: reset_token,
               reset_password_expire: new Date(Date.now() + 15 * 60 * 1000),
          });

          await this.mail.onSendForgotPassword(user, reset_token);

          return user;
     }

     async resetPassword(reset_token: string, password: string): Promise<User> {
          const user = await this.usersService.findOneByResetToken(reset_token);
          if (!user || user.reset_password_expire < new Date())
               throw new UnauthorizedException('Token expired');

          const hashedPassword = await bcrypt.hash(password, 10);

          user.password = hashedPassword;
          user.reset_password_token = null;
          user.reset_password_expire = null;

          await this.usersService.update(user.id, {
               password: hashedPassword,
               reset_password_token: null,
               reset_password_expire: null,
          });

          return user;
     }
}
