import { BarberController } from '@barber/barber.controller';
import { BarberGrpcController } from '@barber/barber.grpc.controller';
import { BarberRepository } from '@barber/barber.repository';
import { BarberService } from '@barber/barber.service';
import { AdminGuard } from '@common/guards/admin.guards';
import { AddBarberIdToBodyInterceptor } from '@common/intercept/add-barber-id-to-body.intercept';
import { AddUserToBodyInterceptor } from '@common/intercept/add-user-to-body.intercept';
import { GrpcModule } from '@grpc/grpc.module';
import { UserGrpcClientService } from '@grpc/services/user/user.grpc-client.service';
import { Module } from '@nestjs/common';
import { S3Service } from '@s3/s3.service';

@Module({
  controllers: [BarberController, BarberGrpcController],
  imports: [GrpcModule],
  providers: [
    BarberService,
    BarberRepository,
    UserGrpcClientService,
    AddUserToBodyInterceptor,
    AddBarberIdToBodyInterceptor,
    AdminGuard,
    S3Service,
  ],
  exports: [BarberService, BarberRepository],
})
export class BarberModule {}
