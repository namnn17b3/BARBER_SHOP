import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { LoggerService } from '@logger/logger.service';
import * as grpc from '@grpc/grpc-js';
import {
  AppResponseErrorDto,
  FieldErrorsResponseDto,
} from '@common/dto/response.dto';
import { GRPC_CODE } from '@common/constant/grpc-code.constant';

const logger = new LoggerService();

@Catch(RpcException)
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    logger.error(exception.message, exception.stack, 'RpcException');

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { code, details }: any = exception.getError();

    switch (code) {
      case grpc.status.FAILED_PRECONDITION:
      case grpc.status.INVALID_ARGUMENT: {
        const statusCode = GRPC_CODE[code];
        const errors = JSON.parse(details);
        response.status(statusCode).json({
          errors,
        } as FieldErrorsResponseDto);
        break;
      }
      case grpc.status.UNAUTHENTICATED:
        response.status(GRPC_CODE[code]).json({
          status: GRPC_CODE[code],
          message: details,
        });
        break;
      case grpc.status.NOT_FOUND:
      case grpc.status.PERMISSION_DENIED:
      case grpc.status.INTERNAL:
        response.status(GRPC_CODE[code]).json({
          error: [],
        });
        break;
      default:
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: [],
        });
    }
  }
}
