import { HttpStatus } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';

export const GRPC_CODE = {
  [grpc.status.OK]: HttpStatus.OK,
  [grpc.status.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
  [grpc.status.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [grpc.status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
  [grpc.status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
  [grpc.status.FAILED_PRECONDITION]: HttpStatus.CONFLICT,
  [grpc.status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
};
