import { UserGrpcClientService } from '@grpc/services/user/user.grpc-client.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class AddUserToBodyInterceptor implements NestInterceptor {
  constructor(private readonly userGrpcClientService: UserGrpcClientService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.['authorization']?.split(' ')?.[1];
    request.body.user = null;
    try {
      const user =
        (await this.userGrpcClientService.checkAuthen({ token }))?.user || null;
      request.body.user = user;
    } catch (error) {}

    return next.handle();
  }
}
