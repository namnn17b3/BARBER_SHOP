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
      provide: USER_PACKAGE_NAME,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: USER_PACKAGE_NAME,
            protoPath: join(
              __dirname,
              '..',
              '..',
              'grpc/protos/user/user.proto',
            ),
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
            protoPath: join(__dirname, '..', '..', 'grpc/protos/s3/s3.proto'),
            loader,
            url: configService.get('S3_GRPC_URL'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [USER_PACKAGE_NAME, S3_PACKAGE_NAME],
})
export class GrpcModule {}
