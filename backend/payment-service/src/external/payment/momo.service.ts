import { PaymentExternalResponseDto } from '@common/dto/external/payment-external-response.dto';
import {
  AppResponseErrorDto,
  AppResponseSuccessDto,
} from '@common/dto/response.dto';
import { PayOnlineType } from '@common/enum/pay-online-type.enum';
import { StatusEnum } from '@common/enum/status.enum';
import { PaymentExternalService } from '@external/payment/payment-external.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PaymentService } from '@payment/payment.service';
import * as querystring from 'qs';
import * as sortObject from 'sort-object';
import * as crypto from 'crypto';
import { ClientKafka } from '@nestjs/microservices';
import { PaymentRequestDto } from '@common/dto/payment-request.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MoMoService implements PaymentExternalService {
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
      payOnlineType: PayOnlineType.MOMO,
      paymentStatus: 'SUCCESS',
      checksum,
    });

    return {
      RspCode: 0,
      Message: 'OK',
    } as PaymentExternalResponseDto;
  }

  public async transaction(dto: any) {
    const partnerCode = process.env.momo_PartnerCode;
    const accessKey = process.env.momo_AccessKey;
    const secretKey = process.env.momo_SecretKey;

    const orderInfo = dto.orderUUID;
    const orderId = dto.orderUUID;
    const redirectUrl = process.env.momo_RedirectUrl;
    const ipnUrl = `${process.env.momo_IpnUrl}/api/payments/momo-ipn`;
    const requestType = process.env.momo_RequestType;
    const requestId = `${orderId}_${Date.now()}`;
    const extraData = '';
    const lang = 'vi';

    const paymentMomoUrl = process.env.momo_PaymentMomoUrl;

    const rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      `${dto.amount}` +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;

    //signature
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: process.env.momo_PartnerName,
      storeId: process.env.momo_StoreId,
      requestId: requestId,
      amount: dto.amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      extraData: extraData,
      signature: signature,
    });

    const response = await fetch(paymentMomoUrl, {
      method: 'POST',
      body: requestBody,
      headers: { 'Content-Type': 'application/json' },
    });
    const result: any = await response.json();
    return {
      status: StatusEnum.OK,
      message: 'OK',
      data: { redirect: result.payUrl },
    } as AppResponseSuccessDto;
  }

  public async verify(returnParams: any): Promise<number> {
    console.log('>>>> returnParams', returnParams);
    let momoParams = returnParams;

    if (+momoParams['resultCode'] != 0) {
      return 2;
    }

    const accessKey = process.env.momo_AccessKey;
    const secretKey = process.env.momo_SecretKey;

    const signature = momoParams['signature'];
    delete momoParams['signature'];
    delete momoParams['paymentOption'];

    const rawSignature =
      `accessKey=${accessKey}&` +
      querystring.stringify(sortObject(momoParams), {
        encode: false,
      });

    const signed = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    if (signature === signed) {
      return 1;
    }
    return 0;
  }
}
