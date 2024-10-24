import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '@/modules/users/users.service';
import { IAppConfiguration } from '@/shared/config/app.config';
import { IJwtPayload } from '@/shared/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
     constructor(
          private readonly usersService: UsersService,
          private readonly config: ConfigService,
     ) {
          super({
               jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
               ignoreExpiration: false,
               secretOrKey: config.get<IAppConfiguration>('app').JWT_SECRET_KEY,
          });
     }

     public async validate(payload: IJwtPayload) {
          const user = await this.usersService.findById(payload.sub);
          if (!user) throw new UnauthorizedException();

          return user;
     }
}
