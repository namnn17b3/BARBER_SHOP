import { AdminGuard } from '@common/guards/admin.guards';
import { AddHairStyleIdToBodyInterceptor } from '@common/intercept/add-hair-style-id-to-body.intercept';
import { AddRequestBodyToBodyInterceptor } from '@common/intercept/add-request-method-to-body';
import { GrpcModule } from '@grpc/grpc.module';
import { FeedbackGrpcClientService } from '@grpc/services/feedback/feedback.grpc-client.service';
import { OrderGrpcClientService } from '@grpc/services/order/order.grpc-client.service';
import { S3GrpcClientService } from '@grpc/services/s3/s3.grpc-client.service';
import { UserGrpcClientService } from '@grpc/services/user/user.grpc-client.service';
import { HairStyleController } from '@hair-style/hair-style.controller';
import { HairStyleGrpcController } from '@hair-style/hair-style.grpc.controller';
import { HairStyleSchema } from '@hair-style/hair-style.model';
import { HairStyleService } from '@hair-style/hair-style.service';
import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

@Module({
  controllers: [HairStyleController, HairStyleGrpcController],
  providers: [
    HairStyleService,
    FeedbackGrpcClientService,
    OrderGrpcClientService,
    UserGrpcClientService,
    S3GrpcClientService,
    AdminGuard,
    AddHairStyleIdToBodyInterceptor,
    AddRequestBodyToBodyInterceptor,
  ],
  exports: [HairStyleService],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'HairStyle',
        useFactory: async (connection: Connection) => {
          const schema = HairStyleSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'id' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    GrpcModule,
  ],
})
export class HairStyleModule {}
