import {
  GetListHairStyleByIdsRequest,
  HAIR_STYLE_PACKAGE_NAME,
  HAIR_STYLE_SERVICE_NAME,
  HairStyleServiceClient,
} from '@grpc/protos/hair-style/hair-style';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class HairStyleGrpcClientService implements OnModuleInit {
  private client: HairStyleServiceClient;

  constructor(
    @Inject(HAIR_STYLE_PACKAGE_NAME)
    private readonly clientHairStyle: ClientGrpc,
  ) {}

  onModuleInit() {
    this.client = this.clientHairStyle.getService<HairStyleServiceClient>(
      HAIR_STYLE_SERVICE_NAME,
    );
  }

  getListHairStyleByIds(request: GetListHairStyleByIdsRequest) {
    return firstValueFrom(
      this.client
        .getListHairStyleByIds(request)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }
}
