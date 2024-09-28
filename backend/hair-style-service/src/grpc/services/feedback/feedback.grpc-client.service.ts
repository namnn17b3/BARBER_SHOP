import {
  FEEDBACK_PACKAGE_NAME,
  FEEDBACK_SERVICE_NAME,
  FeedbackServiceClient,
  GetListHairStyleRequest,
} from '@grpc/protos/feedback/feedback';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class FeedbackGrpcClientService implements OnModuleInit {
  private client: FeedbackServiceClient;

  constructor(
    @Inject(FEEDBACK_PACKAGE_NAME)
    private readonly clientFeedback: ClientGrpc,
  ) {}

  onModuleInit() {
    this.client = this.clientFeedback.getService<FeedbackServiceClient>(
      FEEDBACK_SERVICE_NAME,
    );
  }

  getListHairStyles(request: GetListHairStyleRequest) {
    return firstValueFrom(
      this.client
        .getListHairStyle(request)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }
}
