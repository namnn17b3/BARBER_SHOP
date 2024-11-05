import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import {
  REGISTER_PROCESS,
  SEND_EMAIL_PROCESSOR,
  SEND_EMAIL_THANK_FOR_ORDER_PROCESS,
} from '@common/constants/kafka-topic.constant';
import { capitalize } from '@common/utils/utils';

@Processor(SEND_EMAIL_PROCESSOR)
export class EmailConsumer {
  constructor(private mailerService: MailerService) {}

  @Process(REGISTER_PROCESS)
  async registerEmail(job: Job<any>) {
    console.log('data confirm registerEmail', job.data);
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

  @Process(SEND_EMAIL_THANK_FOR_ORDER_PROCESS)
  async sendEmailThankForOrder(job: Job<any>) {
    console.log(
      'data confirm sendEmailThankForOrder',
      job.data.user.email === 'wayluanmtp@gmail.com',
    );
    const time1 = new Date();
    await this.mailerService.sendMail({
      to: job.data.user.email,
      subject: 'Thanks for your order!',
      template: './thank-for-order',
      context: {
        order: {
          ...job.data,
          hairColor: {
            ...job.data.hairColor,
            color: capitalize(job.data.hairColor.color),
          },
          statusColorCode:
            job.data.status === 'Success' ? '#28a745' : '#dc3545',
        },
      },
    });
    const time2 = new Date();
    console.log('Send Success: ', time2.getTime() - time1.getTime(), 'ms');
  }
}
