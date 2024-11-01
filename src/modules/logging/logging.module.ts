import { Global, DynamicModule, Module } from '@nestjs/common';
import { MessageLogger } from '@/shared/interfaces/message.interface';
import { LoggingService } from '@/modules/logging/logging.service';
import { DependencyKey } from '@/modules/logging/constants/dep_keys.constant';

@Global()
@Module({})
export class LoggingModule {
     static register(messageLogger: MessageLogger): DynamicModule {
          return {
               module: LoggingModule,
               providers: [
                    {
                         provide: DependencyKey.MESSAGE_LOGGER,
                         useValue: messageLogger,
                    },

                    LoggingService,
               ],

               exports: [LoggingService],
          };
     }
}
