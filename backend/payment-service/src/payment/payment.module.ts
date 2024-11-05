import { MoMoService } from '@external/payment/momo.service';
import { VNPAYService } from '@external/payment/vnpay.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentController } from '@payment/payment.controller';
import { PaymentGrpcController } from '@payment/payment.grpc.controller';
import { PaymentRepository } from '@payment/payment.repository';
import { PaymentService } from '@payment/payment.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  controllers: [PaymentController, PaymentGrpcController],
  providers: [PaymentService, PaymentRepository, VNPAYService, MoMoService],
  exports: [PaymentService, PaymentRepository],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'PAYMENT_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'payment-service',
              brokers: [configService.get('KAFKA_BROKER')],
            },
            consumer: {
              groupId: 'payment-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        username: configService.get<string>('REDIS_USERNAME'),
        password: configService.get<string>('REDIS_PASSWORD'),
      }),
    }),
  ],
})
export class PaymentModule {}
