import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { BARBER_PACKAGE_NAME } from '@protos/barber';

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
        url: configService.get('BARBER_GRPC_URL'),
        package: BARBER_PACKAGE_NAME,
        protoPath: join(__dirname, '..', 'protos/barber.proto'),
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  await Promise.all([
    app.startAllMicroservices(),
    app.listen(+configService.get('PORT'), configService.get('HOST')),
  ]);
}
bootstrap();
