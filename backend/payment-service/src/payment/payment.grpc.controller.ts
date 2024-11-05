import { PayOnlineType } from '@common/enum/pay-online-type.enum';
import { MoMoService } from '@external/payment/momo.service';
import { VNPAYService } from '@external/payment/vnpay.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Inject } from '@nestjs/common';
import { PaymentStatus, PaymentType } from '@payment/payment.enum';
import { PaymentService } from '@payment/payment.service';
import {
  GetListPaymentByOrderIdsRequest,
  PaymentServiceController,
  PaymentServiceControllerMethods,
  SaveNewPaymentRequest,
  SaveNewPaymentResponse,
  TransactionRequest,
  TransactionResponse,
} from '@protos/payment';
import { Cache } from 'cache-manager';

@PaymentServiceControllerMethods()
@Controller()
export class PaymentGrpcController implements PaymentServiceController {
  constructor(
    private readonly vnpayService: VNPAYService,
    private readonly momoService: MoMoService,
    private readonly paymentService: PaymentService,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async transaction(request: TransactionRequest) {
    if (request.paymentType === PaymentType.VNPAY) {
      return {
        paymentUrl: (
          await this.vnpayService.transaction(
            {
              orderUUID: request.orderUUID,
              amount: request.amount,
            },
            '127.0.0.1',
            'vi',
          )
        ).data.redirect,
      } as TransactionResponse;
    }

    return {
      paymentUrl: (
        await this.momoService.transaction({
          orderUUID: request.orderUUID,
          amount: request.amount,
        })
      ).data.redirect,
    } as TransactionResponse;
  }

  async saveNewPayment(request: SaveNewPaymentRequest) {
    const externalRequestDto = JSON.parse(request.externalRequest);
    const paymentRequestDto = {
      orderId: request.orderId,
      amount: request.amount,
    };
    const payOnlineType = request.payOnlineType;
    const paymentStatus = request.paymentStatus;
    await this.paymentService.saveNewPayment(
      externalRequestDto,
      paymentRequestDto,
      payOnlineType === 'VNPAY' ? PayOnlineType.VNPAY : PayOnlineType.MOMO,
      paymentStatus === 'SUCCESS' ? PaymentStatus.SUCCESS : PaymentStatus.FAIL,
    );

    await this.cacheManager.del(request.orderUUID.toString());

    return {
      message: 'Payment created successfully',
    } as SaveNewPaymentResponse;
  }

  async getListPaymentByOrderIds(request: GetListPaymentByOrderIdsRequest) {
    return this.paymentService.getListPaymentByOrderIds(request.orderIds);
  }
}
