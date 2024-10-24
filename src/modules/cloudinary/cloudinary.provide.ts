import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConstant } from '@/shared/constants/cloudinary.constant';
import { IAppConfiguration } from '@/shared/config/app.config';

export const CloudinaryProvider: Provider = {
     provide: CloudinaryConstant.CLOUDINARY,
     useFactory: (config: ConfigService<IAppConfiguration>) => {
          cloudinary.config({
               cloud_name: config.get('CLOUDINARY_API_NAME'),
               api_key: config.get('CLOUDINARY_API_KEY'),
               api_secret: config.get('CLOUDINARY_API_SECRET'),
          });

          return cloudinary;
     },

     inject: [ConfigService],
};
