import { AppService } from '@app.service';
import {
  REGISTER_PROCESS,
  SEND_EMAIL_REGISTER,
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
      this.logger.error('AppController', error.stack);
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
