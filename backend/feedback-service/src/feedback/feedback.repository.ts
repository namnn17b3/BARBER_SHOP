import { BaseRepository } from '@common/repository/base.repository';
import { Feedback } from '@feedback/feedback.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class FeedbackRepository extends BaseRepository<Feedback> {
  constructor(dataSource: DataSource) {
    super(Feedback, dataSource);
  }
}
