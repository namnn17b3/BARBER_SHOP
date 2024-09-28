import { Gender } from '@barber/barber-gender.enum';
import { BaseEntity } from '@common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('barber')
export class Barber extends BaseEntity<Barber> {
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'age', type: 'int' })
  age: number;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
  })
  gender: Gender;

  @Column({ name: 'description', type: 'varchar', length: 500 })
  description: string;

  @Column({ name: 'img', type: 'varchar', length: 255 })
  img: string;

  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;
}
