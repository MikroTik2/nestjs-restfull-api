import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from '@/modules/mail/mail.service';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { IAppConfiguration } from '@/shared/config/app.config';

@Module({
     imports: [
          MailerModule.forRootAsync({
               useFactory: (config: ConfigService<IAppConfiguration>) => ({
                    transport: {
                         service: config.get('EMAIL_SERVICE'),
                         port: config.get('EMAIL_PORT'),
                         secure: false,
                         auth: {
                              user: config.get('EMAIL_USER'),
                              pass: config.get('EMAIL_PASS'),
                         },
                    },

                    defaults: {
                         from: '"No Reply" <no-reply@example.com>',
                    },

                    template: {
                         dir: join(
                              __dirname,
                              '..',
                              '..',
                              '..',
                              'src',
                              'modules',
                              'mail',
                              'templates',
                         ),
                         adapter: new EjsAdapter(),
                    },

                    preview: true,
               }),

               inject: [ConfigService],
          }),
     ],
     providers: [MailService],
     exports: [MailService],
})
export class MailModule {}
