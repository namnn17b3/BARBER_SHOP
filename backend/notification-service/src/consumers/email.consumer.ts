import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import {
  REGISTER_PROCESS,
  SEND_EMAIL_PROCESSOR,
} from '@common/constants/kafka-topic.constant';

@Processor(SEND_EMAIL_PROCESSOR)
export class EmailConsumer {
  constructor(private mailerService: MailerService) {}

  @Process(REGISTER_PROCESS)
  async registerEmail(job: Job<any>) {
    console.log(job.data);
    const time1 = new Date();
    await this.mailerService.sendMail({
      to: job.data.email,
      subject: 'Welcome to my website',
      template: './thank-for-register',
      context: job.data,
    });
    const time2 = new Date();
    console.log('Send Success: ', time2.getTime() - time1.getTime(), 'ms');
  }
}
