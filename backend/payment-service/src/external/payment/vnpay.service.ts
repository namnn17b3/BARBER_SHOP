import * as dotenv from 'dotenv';
dotenv.config();

import { PaymentExternalResponseDto } from '@common/dto/external/payment-external-response.dto';
import {
  AppResponseErrorDto,
  AppResponseSuccessDto,
} from '@common/dto/response.dto';
import { StatusEnum } from '@common/enum/status.enum';
import { PaymentExternalService } from '@external/payment/payment-external.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PaymentService } from '@payment/payment.service';
import * as querystring from 'qs';
import * as sortObject from 'sort-object';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import { PayOnlineType } from '@common/enum/pay-online-type.enum';
import { PaymentStatus } from '@payment/payment.enum';
import { ClientKafka } from '@nestjs/microservices';
import { PaymentRequestDto } from '@common/dto/payment-request.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class VNPAYService implements PaymentExternalService {
  constructor(
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,

    @Inject('PAYMENT_SERVICE')
    private readonly paymentKafkaClient: ClientKafka,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  public async ipnProcess(
    externalRequestDto: any,
    paymentRequestDto: PaymentRequestDto,
  ): Promise<PaymentExternalResponseDto> {
    const checksum = await this.verify(externalRequestDto);

    if (checksum == 0) {
      this.cacheManager.del(paymentRequestDto.orderUUID.toString());
      throw {
        status: StatusEnum.BAD_REQUEST,
        message: 'Bad Request',
        errors: {
          checksum: 'Checksum faile',
        },
      } as AppResponseErrorDto;
    }

    if (checksum == 2) {
      this.cacheManager.del(paymentRequestDto.orderUUID.toString());
      throw {
        status: StatusEnum.BAD_REQUEST,
        message: 'Errors',
        errors: {
          code: 97,
        },
      } as AppResponseErrorDto;
    }

    this.paymentKafkaClient.emit('checksum', {
      orderUUID: paymentRequestDto.orderUUID,
      externalRequest: JSON.stringify(externalRequestDto),
      amount: paymentRequestDto.amount,
      payOnlineType: PayOnlineType.VNPAY,
      paymentStatus: PaymentStatus.SUCCESS,
      checksum,
    });

    return {
      RspCode: '00',
      Message: 'OK',
    } as PaymentExternalResponseDto;
  }

  public async transaction(
    dto: any,
    ipAddr?: string | string[],
    language?: string,
  ) {
    const tmnCode = process.env.vnp_TmnCode;
    const secretKey = process.env.vnp_HashSecret;
    let vnpUrl = process.env.vnp_Url;
    const returnUrl = process.env.vnp_ReturnUrl;

    const date = new Date();
    const createDate = dayjs(date).format('YYYYMMDDHHmmss');
    const orderUUID = dto.orderUUID;
    const bankCode = '';
    const orderInfo = dto.orderUUID;
    const orderType = process.env.vnp_OrderType;
    const locale = language ? language : 'vn';

    const currCode = 'VND';
    let vnpParams = {};
    vnpParams['vnp_Version'] = process.env.vnp_Version;
    vnpParams['vnp_Command'] = process.env.vnp_Command;
    vnpParams['vnp_TmnCode'] = tmnCode;

    vnpParams['vnp_Locale'] = locale;
    vnpParams['vnp_CurrCode'] = currCode;
    vnpParams['vnp_TxnRef'] = orderUUID;
    vnpParams['vnp_OrderInfo'] = orderInfo;
    vnpParams['vnp_OrderType'] = orderType;
    vnpParams['vnp_Amount'] = dto.amount * 100;
    vnpParams['vnp_ReturnUrl'] = returnUrl;
    vnpParams['vnp_IpAddr'] = ipAddr;
    vnpParams['vnp_CreateDate'] = createDate;
    if (bankCode) {
      vnpParams['vnp_BankCode'] = bankCode;
    }

    vnpParams = sortObject(vnpParams);

    const signData = querystring.stringify(vnpParams, { encode: true });

    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnpParams['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnpParams, { encode: true });

    return {
      status: StatusEnum.OK,
      message: 'OK',
      data: { redirect: vnpUrl },
    } as AppResponseSuccessDto;
  }

  public async verify(returnParams: any): Promise<number> {
    let vnpParams = returnParams;

    if (+returnParams['vnp_ResponseCode'] != 0) {
      return 2;
    }

    const secureHash = vnpParams['vnp_SecureHash'];

    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    vnpParams = sortObject(vnpParams);

    const tmnCode = process.env.vnp_TmnCode;
    const secretKey = process.env.vnp_HashSecret;

    const signData = querystring.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      return 1;
    }
    return 0;
  }
}
