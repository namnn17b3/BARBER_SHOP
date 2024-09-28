import { Controller } from '@nestjs/common';
import { PaymentService } from '@payment/payment.service';

@Controller('/api/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
}
