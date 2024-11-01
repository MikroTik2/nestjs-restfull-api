import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidateInputPipe } from '@/shared/pipes/validate.pipe';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { ConfigService } from '@nestjs/config';
import { IAppConfiguration } from '@/shared/config/app.config';
import document from '@/document';

import * as cookie from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
     const app = await NestFactory.create<NestExpressApplication>(AppModule, {
          cors: true,
     });
     const logger = new Logger('NestAplication');

     app.useGlobalPipes(new ValidateInputPipe());
     app.setGlobalPrefix('api/v1');

     app.use(cookie());
     app.use(helmet());
     app.enableCors({
          origin: '*',
          credentials: true,
          methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
     });

     const config: ConfigService<IAppConfiguration> = new ConfigService();
     const port = config.get<number>('PORT') || 3050;

     const isDevelopmentMode: boolean =
          config.get<string>('NODE_ENV').toUpperCase() === 'DEVELOPMENT';

     const DOCUMENT_ROUTE = '/api';

     if (isDevelopmentMode) document(app, DOCUMENT_ROUTE);

     await app.listen(port);

     logger.debug(`Server running on http://localhost:${port}`);

     const appUrl: string = isDevelopmentMode ? `http://localhost:${port}` : await app.getUrl();

     logger.debug(`GraphQl: ${appUrl}/graphql`);

     isDevelopmentMode && logger.debug(`RestApi: http://localhost:${port}${DOCUMENT_ROUTE}`);
}

bootstrap();
