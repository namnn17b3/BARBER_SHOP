import { BaseEntity } from '@common/entity/base.entity';
import { PaymentStatus, PaymentType } from '@payment/payment.enum';
import { Column, Entity } from 'typeorm';

@Entity('payment')
export class Payment extends BaseEntity<Payment> {
  @Column({ name: 'order_id', type: 'int' })
  orderId: number;

  @Column({ name: 'status', type: 'enum', enum: PaymentStatus })
  status: string;

  @Column({ name: 'type', type: 'enum', enum: PaymentType })
  type: string;

  @Column({ name: 'bank_code', type: 'varchar', length: 50 })
  bankCode: string;

  @Column({ name: 'pay_time', type: 'timestamp' })
  payTime: Date;

  @Column({ name: 'bank_tran_no', type: 'varchar', length: 50 })
  bankTranNo: string;

  @Column({ name: 'amount', type: 'int' })
  amount: number;
}
