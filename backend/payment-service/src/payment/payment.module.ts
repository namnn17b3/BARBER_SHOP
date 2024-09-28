import { Module } from '@nestjs/common';
import { PaymentController } from '@payment/payment.controller';
import { PaymentRepository } from '@payment/payment.repository';
import { PaymentService } from '@payment/payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
  exports: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
