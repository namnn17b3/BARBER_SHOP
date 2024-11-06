import { UserGrpcClientService } from '@grpc/services/user/user.grpc-client.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenGuard implements CanActivate {
  constructor(private readonly userGrpcClientService: UserGrpcClientService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.['authorization']?.split(' ')?.[1];

    const user =
      (
        await this.userGrpcClientService.checkAuthen({
          token,
        })
      )?.user || null;

    request.body.user = user;
    if (user) return true;
    return false;
  }
}
