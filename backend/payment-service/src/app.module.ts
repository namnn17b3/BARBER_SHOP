import { GlobalExceptionFilter } from '@common/exception-filter/global-exception.filter';
import { ResponseLogger } from '@common/intercept/response-logger.intercept';
import { TrimBodyPipe } from '@common/validate-pipe/trim-body.pipe';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  APP_FILTER,
  APP_INTERCEPTOR,
  APP_PIPE,
  RouterModule,
} from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from '@payment/payment.module';
import { AppDataSource } from 'datasource';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({}),
      dataSourceFactory: async () => {
        initializeTransactionalContext({
          storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE,
        });
        return addTransactionalDataSource(AppDataSource);
      },
    }),
    RouterModule.register([]),
    PaymentModule,
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
