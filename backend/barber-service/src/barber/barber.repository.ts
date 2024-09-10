import { Barber } from '@barber/barber.entity';
import { BaseRepository } from '@common/repository/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class BarberRepository extends BaseRepository<Barber> {
  constructor(dataSource: DataSource) {
    super(Barber, dataSource);
  }
}
