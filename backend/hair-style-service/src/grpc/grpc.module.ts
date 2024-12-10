import { FEEDBACK_PACKAGE_NAME } from '@grpc/protos/feedback/feedback';
import { ORDER_PACKAGE_NAME } from '@grpc/protos/order/order';
import { S3_PACKAGE_NAME } from '@grpc/protos/s3/s3';
import { USER_PACKAGE_NAME } from '@grpc/protos/user/user';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const loader = {
  longs: String,
  enums: String,
  defaults: true,
  arrays: true,
  objects: true,
  oneofs: false,
};

@Module({
  imports: [],
  providers: [
    {
      provide: ORDER_PACKAGE_NAME,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ORDER_PACKAGE_NAME,
            protoPath: join(__dirname, './protos/order/order.proto'),
            loader,
            url: configService.get('ORDER_GRPC_URL'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: FEEDBACK_PACKAGE_NAME,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: FEEDBACK_PACKAGE_NAME,
            protoPath: join(__dirname, './protos/feedback/feedback.proto'),
            loader,
            url: configService.get('FEEDBACK_GRPC_URL'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: USER_PACKAGE_NAME,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: USER_PACKAGE_NAME,
            protoPath: join(__dirname, './protos/user/user.proto'),
            loader,
            url: configService.get('USER_GRPC_URL'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: S3_PACKAGE_NAME,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: S3_PACKAGE_NAME,
            protoPath: join(__dirname, './protos/s3/s3.proto'),
            loader,
            url: configService.get('S3_GRPC_URL'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    ORDER_PACKAGE_NAME,
    FEEDBACK_PACKAGE_NAME,
    USER_PACKAGE_NAME,
    S3_PACKAGE_NAME,
  ],
})
export class GrpcModule {}
