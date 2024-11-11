import { AppService } from '@app.service';
import {
  REGISTER_PROCESS,
  SEND_EMAIL_RESET_PASSWORD,
  SEND_EMAIL_RESET_PASSWORD_PROCESS,
  SEND_EMAIL_REGISTER,
  SEND_EMAIL_THANK_FOR_ORDER,
  SEND_EMAIL_THANK_FOR_ORDER_PROCESS,
} from '@common/constants/kafka-topic.constant';
import { LoggerService } from '@logger/logger.service';
import { Controller, Get, Query } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    private readonly logger: LoggerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern(SEND_EMAIL_REGISTER)
  async sendEmailRegister(@Payload() message: any) {
    try {
      const user = JSON.parse(JSON.parse(message));
      console.log('>>> sendEmailRegister kafka:', user);
      await this.appService.sendMailJob(REGISTER_PROCESS, user);
    } catch (error) {
      this.logger.error('AppController.sendEmailRegister', error.stack);
    }
  }

  @EventPattern(SEND_EMAIL_THANK_FOR_ORDER)
  async sendEmailThankForOrder(@Payload() message: any) {
    try {
      const order = JSON.parse(JSON.parse(message));
      console.log('>>> sendEmailThankForOrder kafka:', order);
      await this.appService.sendMailJob(
        SEND_EMAIL_THANK_FOR_ORDER_PROCESS,
        order,
      );
    } catch (error) {
      this.logger.error('AppController.sendEmailThankForOrder', error.stack);
    }
  }

  @EventPattern(SEND_EMAIL_RESET_PASSWORD)
  async sendEmailResetPassword(@Payload() message: any) {
    try {
      const order = JSON.parse(JSON.parse(message));
      console.log('>>> sendEmailResetPassword kafka:', order);
      await this.appService.sendMailJob(
        SEND_EMAIL_RESET_PASSWORD_PROCESS,
        order,
      );
    } catch (error) {
      this.logger.error('AppController.sendEmailResetPassword', error.stack);
    }
  }

  @Get('/test')
  async test(@Query('email') email: string) {
    console.log('>>> sendEmailRegister http:', email);
    await this.appService.sendMailJob(REGISTER_PROCESS, {
      to: '"wayluanmtp@gmail.com"',
      name: 'My Friend',
    });
  }
}
