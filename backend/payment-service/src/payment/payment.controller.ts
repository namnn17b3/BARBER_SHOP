import { PaymentRequestDto } from '@common/dto/payment-request.dto';
import { AppResponseSuccessDto } from '@common/dto/response.dto';
import { AdminGuard } from '@common/guards/admin.guards';
import { FormattedValidationPipe } from '@common/validate-pipe/formatted-validation.pipe';
import { MoMoService } from '@external/payment/momo.service';
import { VNPAYService } from '@external/payment/vnpay.service';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  StatisticItemsRequestDto,
  StatisticRevenuesRequestDto,
} from '@payment/payment.dto';
import { PaymentService } from '@payment/payment.service';

@Controller('/api/payments')
export class PaymentController {
  constructor(
    private readonly vnpayService: VNPAYService,
    private readonly momoService: MoMoService,
    private readonly paymentService: PaymentService,
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

  @UseGuards(AdminGuard)
  @Get('/admin/statistic-items')
  async statisticItems(
    @Query(new FormattedValidationPipe('StatisticItemsRequestDto'))
    statisticItemsDto: StatisticItemsRequestDto,
  ) {
    return this.paymentService.statisticItems(statisticItemsDto);
  }

  @UseGuards(AdminGuard)
  @Get('/admin/statistic-revenues')
  async statisticRevenues(
    @Query(new FormattedValidationPipe('StatisticRevenuesRequestDto'))
    statisticRevenuesRequestDto: StatisticRevenuesRequestDto,
  ) {
    return this.paymentService.statisticRevenues(statisticRevenuesRequestDto);
  }
}
