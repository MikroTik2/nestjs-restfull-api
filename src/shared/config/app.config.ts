import { registerAs } from '@nestjs/config';

export interface IAppConfiguration {
     PORT: number;

     DATABASE_URL: string;

     JWT_SECRET_KEY: string;
     JWT_EXPIRATION_TIME: string;

     CLOUDINARY_API_KEY: string;
     CLOUDINARY_API_NAME: string;
     CLOUDINARY_API_SECRET: string;

     GOOGLE_CLIENT_ID: string;
     GOOGLE_CLIENT_SECRET: string;
     GOOGLE_CLIENT_URL: string;

     GITHUB_CLIENT_ID: string;
     GITHUB_CLIENT_SECRET: string;
     GITHUB_CALLBACK_URL: string;

     EMAIL_USER: string;
     EMAIL_PASS: string;
     EMAIL_SERVICE: string;
     EMAIL_HOST: string;
     EMAIL_PORT: number;

     NODE_ENV: string;
}

export default registerAs(
     'app',
     (): IAppConfiguration => ({
          PORT: Number(process.env.PORT),

          DATABASE_URL: process.env.DATABASE_URL,

          JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
          JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,

          CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
          CLOUDINARY_API_NAME: process.env.CLOUDINARY_API_NAME,
          CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
          GOOGLE_CLIENT_URL: process.env.GOOGLE_CLIENT_URL,

          GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
          GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
          GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,

          EMAIL_USER: process.env.EMAIL_USER,
          EMAIL_PASS: process.env.EMAIL_PASS,
          EMAIL_SERVICE: process.env.EMAIL_SERVICE,
          EMAIL_HOST: process.env.EMAIL_HOST,
          EMAIL_PORT: Number(process.env.EMAIL_PORT),

          NODE_ENV: process.env.NODE_ENV,
     }),
);
