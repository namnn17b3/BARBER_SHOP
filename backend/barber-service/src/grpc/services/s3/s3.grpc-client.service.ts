import {
  DeleteFileRequest,
  S3_PACKAGE_NAME,
  S3_SERVICE_NAME,
  S3ServiceClient,
  UploadFileRequest,
} from '@grpc/protos/s3/s3';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class S3GrpcClientService implements OnModuleInit {
  private client: S3ServiceClient;

  constructor(
    @Inject(S3_PACKAGE_NAME)
    private readonly clientS3: ClientGrpc,
  ) {}

  onModuleInit() {
    this.client = this.clientS3.getService<S3ServiceClient>(S3_SERVICE_NAME);
  }

  uploadFile(request: UploadFileRequest) {
    return firstValueFrom(
      this.client
        .uploadFile(request)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  deleteFile(request: DeleteFileRequest) {
    return firstValueFrom(
      this.client
        .deleteFile(request)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }
}
