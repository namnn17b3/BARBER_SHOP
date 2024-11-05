import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GlobalExceptionFilter } from '@common/exception-filter/global-exception.filter';
import { ResponseLogger } from '@common/intercept/response-logger.intercept';
import { TrimBodyPipe } from '@common/validate-pipe/trim-body.pipe';
import { GrpcModule } from '@grpc/grpc.module';
import { HairStyleModule } from '@hair-style/hair-style.module';
import {
  APP_FILTER,
  APP_INTERCEPTOR,
  APP_PIPE,
  RouterModule,
} from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_DB_URL'),
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    RouterModule.register([]),
    GrpcModule,
    HairStyleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseLogger,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: TrimBodyPipe,
    },
  ],
})
export class AppModule {}
