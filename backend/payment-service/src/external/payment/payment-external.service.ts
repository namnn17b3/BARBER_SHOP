import { PaymentExternalResponseDto } from '@common/dto/external/payment-external-response.dto';
import { PaymentRequestDto } from '@common/dto/payment-request.dto';
import { AppResponseSuccessDto } from '@common/dto/response.dto';

export abstract class PaymentExternalService {
  abstract transaction(
    dto: any,
    ipAddr?: string | string[],
    language?: string,
  ): Promise<AppResponseSuccessDto>;

  abstract ipnProcess(
    externalRequestDto: any,
    PaymentRequestDto: PaymentRequestDto,
  ): Promise<PaymentExternalResponseDto>;

  abstract verify(returnParams: any): Promise<number>;
}
