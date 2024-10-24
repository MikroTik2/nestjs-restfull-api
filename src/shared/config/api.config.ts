import { registerAs } from '@nestjs/config';

export interface IApiConfiguratuin {
     TITLE: string;
     DESCRIPTION: string;
     VERSION: string;
     TAG: string;
}

export default registerAs(
     'api',
     (): IApiConfiguratuin => ({
          TITLE: 'API Documentation',
          DESCRIPTION: 'API Documentation for the application',
          VERSION: '1.0.0',
          TAG: 'API',
     }),
);
