import { UserFeedbackGuard } from '@common/guards/user-feedback.guard';
import { FeedbackController } from '@feedback/feedback.controller';
import { FeedbackGrpcController } from '@feedback/feedback.grpc.controller';
import { FeedbackRepository } from '@feedback/feedback.repository';
import { FeedbackService } from '@feedback/feedback.service';
import { GrpcModule } from '@grpc/grpc.module';
import { OrderGrpcClientService } from '@grpc/services/order/order.grpc-client.service';
import { UserGrpcClientService } from '@grpc/services/user/user.grpc-client.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [GrpcModule],
  controllers: [FeedbackController, FeedbackGrpcController],
  providers: [
    FeedbackService,
    FeedbackRepository,
    OrderGrpcClientService,
    UserGrpcClientService,
    UserFeedbackGuard,
  ],
  exports: [FeedbackService, FeedbackRepository],
})
export class FeedbackModule {}
