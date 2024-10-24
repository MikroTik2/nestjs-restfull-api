import { ConfigService } from '@nestjs/config';
import { IAppConfiguration } from '@/shared/config/app.config';

const jwtConstant = {
     getSecret: (config: ConfigService<IAppConfiguration>): string => config.get('JWT_SECRET_KEY'),
     signOptions: {
          expiresIn: (config: ConfigService<IAppConfiguration>): string =>
               config.get('JWT_EXPIRATION_TIME'),
     },
};

export default jwtConstant;
