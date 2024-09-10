import { SEND_EMAIL_PROCESSOR } from '@common/constants/kafka-topic.constant';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue(SEND_EMAIL_PROCESSOR)
    private readonly sendMail: Queue,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async sendMailJob(processName: string, data: any) {
    console.log('>>> sendMailJob:', processName, data);
    await this.sendMail.add(processName, data, {
      removeOnComplete: true,
      timeout: 10000,
    });
  }
}
