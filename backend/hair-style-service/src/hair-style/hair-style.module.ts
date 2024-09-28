import { GrpcModule } from '@grpc/grpc.module';
import { FeedbackGrpcClientService } from '@grpc/services/feedback/feedback.grpc-client.service';
import { OrderGrpcClientService } from '@grpc/services/order/order.grpc-client.service';
import { HairStyleController } from '@hair-style/hair-style.controller';
import { HairStyleSchema } from '@hair-style/hair-style.model';
import { HairStyleService } from '@hair-style/hair-style.service';
import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

@Module({
  controllers: [HairStyleController],
  providers: [
    HairStyleService,
    FeedbackGrpcClientService,
    OrderGrpcClientService,
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
