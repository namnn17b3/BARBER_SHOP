import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { AppDataSource } from 'datasource';
import {
  APP_FILTER,
  APP_INTERCEPTOR,
  APP_PIPE,
  RouterModule,
} from '@nestjs/core';
import { TrimBodyPipe } from '@common/validate-pipe/trim-body.pipe';
import { ResponseLogger } from '@common/intercept/response-logger.intercept';
import { GlobalExceptionFilter } from '@common/exception-filter/global-exception.filter';
import { FeedbackModule } from '@feedback/feedback.module';

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
    FeedbackModule,
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
