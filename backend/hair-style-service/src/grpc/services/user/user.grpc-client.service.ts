import {
  CheckAuthenRequest,
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@grpc/protos/user/user';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class UserGrpcClientService implements OnModuleInit {
  private client: UserServiceClient;

  constructor(
    @Inject(USER_PACKAGE_NAME)
    private readonly clientUser: ClientGrpc,
  ) {}

  onModuleInit() {
    this.client =
      this.clientUser.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  checkAuthen(request: CheckAuthenRequest) {
    return firstValueFrom(
      this.client
        .checkAuthen(request)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }
}
