import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { IApiConfiguratuin } from '@/shared/config/api.config';
import { SwaggerModule, SwaggerCustomOptions, DocumentBuilder } from '@nestjs/swagger';

export default function document(app: INestApplication, route: string) {
     const config = app.get(ConfigService);
     const api = config.get<IApiConfiguratuin>('api');

     const options = new DocumentBuilder()
          .setTitle(api.TITLE)
          .setDescription(api.DESCRIPTION)
          .setVersion(api.VERSION)
          .addTag(api.TAG)
          .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
          .build();

     const document = SwaggerModule.createDocument(app, options, {
          extraModels: [],
     });

     const customOptions: SwaggerCustomOptions = {
          swaggerOptions: {
               filter: true,
               showRequestDuration: true,
          },
     };

     SwaggerModule.setup(route, app, document, customOptions);
}
