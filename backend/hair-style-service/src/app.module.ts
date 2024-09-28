import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  APP_PIPE,
  RouterModule,
} from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TrimBodyPipe } from '@common/validate-pipe/trim-body.pipe';
import { ResponseLogger } from '@common/intercept/response-logger.intercept';
import { GlobalExceptionFilter } from '@common/exception-filter/global-exception.filter';
import { MongooseModule } from '@nestjs/mongoose';
import { HairStyleModule } from '@hair-style/hair-style.module';
import { GrpcModule } from '@grpc/grpc.module';

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
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 50,
      },
    ]),
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
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useClass: TrimBodyPipe,
    },
  ],
})
export class AppModule {}
