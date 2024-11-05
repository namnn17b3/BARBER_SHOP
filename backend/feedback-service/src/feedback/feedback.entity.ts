import { BaseEntity } from '@common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('feedback')
export class Feedback extends BaseEntity<Feedback> {
  @Column({ name: 'comment', type: 'varchar', length: 255 })
  comment: string;

  @Column({ name: 'star', type: 'int' })
  star: number;

  @Column({ name: 'order_id', type: 'int' })
  orderId: number;

  @Column({ name: 'hair_style_id', type: 'int' })
  hairStyleId: number;

  @Column({ name: 'time', type: 'timestamp' })
  time: Date;
}
