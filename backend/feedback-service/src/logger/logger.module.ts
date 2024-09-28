import { LoggerService } from '@logger/logger.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [LoggerModule],
  controllers: [],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
