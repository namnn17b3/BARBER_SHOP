import {
  GetListHairStyleRequest,
  GetListOrderIdByUserIdRequest,
  GetListUserFeedbackByOrderIdsRequest,
  ORDER_PACKAGE_NAME,
  ORDER_SERVICE_NAME,
  OrderServiceClient,
} from '@grpc/protos/order/order';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class OrderGrpcClientService implements OnModuleInit {
  private client: OrderServiceClient;

  constructor(
    @Inject(ORDER_PACKAGE_NAME)
    private readonly clientOrder: ClientGrpc,
  ) {}

  onModuleInit() {
    this.client =
      this.clientOrder.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  getListHairStyles(request: GetListHairStyleRequest) {
    return firstValueFrom(
      this.client
        .getListHairStyle(request)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  getListUserFeedbackByOrderIds(request: GetListUserFeedbackByOrderIdsRequest) {
    return firstValueFrom(
      this.client
        .getListUserFeedbackByOrderIds(request)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  getListOrderByUserId(request: GetListOrderIdByUserIdRequest) {
    return firstValueFrom(
      this.client
        .getListOrderByUserId(request)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }
}
