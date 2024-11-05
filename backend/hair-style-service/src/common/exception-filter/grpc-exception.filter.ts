import { LoggerService } from '@logger/logger.service';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const logger = new LoggerService();
    logger.error(exception.message, exception.stack, 'GRPC_EXCEPTION');

    throw exception;
  }
}
