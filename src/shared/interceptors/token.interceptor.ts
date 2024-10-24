import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Res } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import type { Response } from 'express';

import { _User } from '@/modules/authentication/authentication.service';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
     constructor() {}

     intercept(context: ExecutionContext, next: CallHandler<_User>): Observable<_User> {
          return next.handle().pipe(
               map((user) => {
                    const response = context.switchToHttp().getResponse<Response>();

                    response.setHeader('Authorization', `Bearer ${user.token}`);
                    response.cookie('token', user.token, {
                         expires: new Date(Date.now() + 7 * 24 * 3600000), // 7d
                         httpOnly: true,
                         sameSite: 'strict',
                         secure: true,
                    });

                    return user;
               }),
          );
     }
}
