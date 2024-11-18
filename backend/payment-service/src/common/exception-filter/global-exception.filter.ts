import { FieldErrorsResponseDto } from '@common/dto/response.dto';
import { LoggerService } from '@logger/logger.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const logger = new LoggerService();
    logger.error(exception.message, exception.stack, 'GLOBAL_EXCEPTION');

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let dataErrors: FieldErrorsResponseDto = {
      errors: [],
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      dataErrors = exception.getResponse() as FieldErrorsResponseDto;
    }

    response.status(status).json(dataErrors);
  }
}
