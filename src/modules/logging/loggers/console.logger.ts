import { MessageLogger } from '@/shared/interfaces/message.interface';
import * as chalk from 'chalk';

export class ConsoleLogger implements MessageLogger {
     error(message: string, stack?: string): void {
          console.log(chalk.red(`[ERROR]`), message);
     }

     log(message: string): void {
          console.log(chalk.gray(`[LOG]`), message);
     }

     warn(message: string, stack?: string): void {
          console.log(chalk.yellow(`[WARN]`), message);
     }
}
