import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
     constructor(private readonly mailerService: MailerService) {}

     public async onSendWelcome(user: User): Promise<void> {
          await this.mailerService.sendMail({
               from: process.env.EMAIL_USER,
               to: user.email,
               subject: `Welcome to Our Platform!`,
               template: 'welcome.ejs',
               context: {
                    username: user.username,
               },
          });
     }

     public async onSendForgotPassword(user: User, token: string): Promise<void> {
          await this.mailerService.sendMail({
               from: process.env.EMAIL_USER,
               to: user.email,
               subject: `Reset Password Request`,
               template: 'forgot-password.ejs',
               context: {
                    username: user.username,
                    reset_link: `http://localhost:3000/api/v1/authentication/reset-password/?token=${token}`,
               },
          });
     }
}
