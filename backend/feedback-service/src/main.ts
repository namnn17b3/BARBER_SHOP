import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { FEEDBACK_PACKAGE_NAME } from '@protos/feedback';
import { GrpcExceptionFilter } from '@common/exception-filter/grpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(helmet());
  app.enableCors();
  app.use(cookieParser());
  app.useBodyParser('json', { limit: configService.get('LIMIT_REQUEST_BODY') });

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.GRPC,
      options: {
        url: configService.get('FEEDBACK_GRPC_URL'),
        package: FEEDBACK_PACKAGE_NAME,
        protoPath: join(__dirname, '..', 'protos/feedback.proto'),
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  app.useGlobalFilters(new GrpcExceptionFilter());

  await Promise.all([
    app.listen(+configService.get('PORT'), configService.get('HOST')),
    app.startAllMicroservices(),
  ]);
}
bootstrap();
