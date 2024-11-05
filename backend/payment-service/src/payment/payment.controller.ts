import { PaymentRequestDto } from '@common/dto/payment-request.dto';
import { AppResponseSuccessDto } from '@common/dto/response.dto';
import { MoMoService } from '@external/payment/momo.service';
import { VNPAYService } from '@external/payment/vnpay.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

@Controller('/api/payments')
export class PaymentController {
  constructor(
    private readonly vnpayService: VNPAYService,
    private readonly momoService: MoMoService,
  ) {}

  @Get('vnpay-ipn')
  async ipnVNPAYCallBack(
    @Query()
    querySearch: any,
  ) {
    console.log('>>>>>>>>>>>>>>> vnpay ipn query search', querySearch);

    const result = await this.vnpayService.ipnProcess(querySearch, {
      orderUUID: querySearch['vnp_OrderInfo'],
      amount: +querySearch['vnp_Amount'] / 100,
    } as PaymentRequestDto);
    return result;
  }

  @Post('momo-ipn')
  async ipnMoMoCallBack(
    @Body()
    body: any,
  ) {
    console.log('>>>>>>>>>>>>>>> momo ipn body', body);
    const result = await this.momoService.ipnProcess(body, {
      orderUUID: body.orderInfo,
      amount: +body.amount,
    } as PaymentRequestDto);
    return result;
  }

  @Get('verify')
  async verify(
    @Query()
    query: any,
  ) {
    let checksum = null;
    if (JSON.stringify(query).includes('vnp')) {
      checksum = await this.vnpayService.verify(query);
    } else {
      checksum = await this.momoService.verify(query);
    }

    return {
      data: {
        checksum,
      },
    } as AppResponseSuccessDto;
  }
}
