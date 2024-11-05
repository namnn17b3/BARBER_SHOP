import { PaymentRequestDto } from '@common/dto/payment-request.dto';
import { DateFormat } from '@common/enum/date-format.enum';
import { PayOnlineType } from '@common/enum/pay-online-type.enum';
import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@payment/payment.enum';
import { PaymentRepository } from '@payment/payment.repository';
import * as dayjs from 'dayjs';
import { In } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async saveNewPayment(
    externalRequestDto: any,
    paymentRequestDto: PaymentRequestDto,
    payOnlineType: PayOnlineType,
    paymentStatus: PaymentStatus,
  ) {
    let payTime = null;
    let bankCode = 'SGB';
    let bankTranNo = null;

    switch (payOnlineType) {
      case PayOnlineType.VNPAY:
        payTime = dayjs(
          externalRequestDto.vnp_PayDate,
          DateFormat.YYYYMMDDHHmmss,
        ).toDate();
        bankCode = externalRequestDto.vnp_BankCode;
        bankTranNo = `${bankCode}${externalRequestDto.vnp_PayDate}`;
        break;
      case PayOnlineType.MOMO:
        payTime = new Date(+externalRequestDto.responseTime);
        bankCode = 'SGB';
        bankTranNo = `${bankCode}${dayjs(payTime).format(DateFormat.YYYYMMDDHHmmss)}`;
        break;
      default:
        break;
    }

    await this.paymentRepository.save({
      amount: paymentRequestDto.amount,
      orderId: paymentRequestDto.orderId,
      status: paymentStatus,
      bankCode,
      bankTranNo,
      type: payOnlineType,
      payTime,
    });
  }

  async getListPaymentByOrderIds(orderIds: number[]) {
    const payments = await this.paymentRepository.find({
      where: {
        orderId: In(orderIds),
      },
    });

    return {
      payments: payments.map((payment) => ({
        id: payment.id,
        orderId: payment.orderId,
        status: payment.status.toString(),
        type: payment.type.toString(),
        bankCode: payment.bankTranNo,
        payTime: payment.payTime.toISOString(),
        bankTranNo: payment.bankTranNo,
        amount: payment.amount,
      })),
    };
  }
}
