import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';
import { LoggerService } from '@logger/logger.service';

@Injectable()
export class ResponseLogger implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { originalUrl, method, params, query, body } = req;
    const { statusCode } = res;
    const logger: LoggerService = new LoggerService();

    logger.log(
      `${method} ${originalUrl}`,
      'RequestInfo',
      JSON.stringify({
        params,
        query,
        body,
      }),
    );

    return next
      .handle()
      .pipe(
        tap((data) =>
          logger.log('ResponseInfo', JSON.stringify({ statusCode, data })),
        ),
      );
  }
}
