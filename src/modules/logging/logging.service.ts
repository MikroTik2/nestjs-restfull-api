import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { MessageLogger } from '@/shared/interfaces/message.interface';
import { DependencyKey } from '@/modules/logging/constants/dep_keys.constant';

@Injectable()
export class LoggingService implements MessageLogger {
     constructor(
          @Inject(DependencyKey.MESSAGE_LOGGER) private readonly messageLogger: MessageLogger,
     ) {}

     error(message: any, ...optionalParams: any[]): any {
          this.messageLogger.error(message);
     }

     log(message: any, ...optionalParams: any[]): any {
          this.messageLogger.error(message);
     }

     warn(message: any, ...optionalParams: any): any {
          this.messageLogger.error(message);
     }
}
