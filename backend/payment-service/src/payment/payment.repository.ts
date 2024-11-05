import { BaseRepository } from '@common/repository/base.repository';
import { Injectable } from '@nestjs/common';
import { Payment } from '@payment/payment.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class PaymentRepository extends BaseRepository<Payment> {
  constructor(dataSource: DataSource) {
    super(Payment, dataSource);
  }
}
