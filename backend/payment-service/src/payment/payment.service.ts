import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '@payment/payment.repository';

@Injectable()
export class PaymentService {
  constructor(private readonly PaymentRepository: PaymentRepository) {}
}
