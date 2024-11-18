import { MonthMeaning } from '@common/constant/month-meaning.constant';
import {
  MAX_DURATION_STATISTIC_REVENUE,
  MIN_DURATION_STATISTIC_REVENUE,
} from '@common/constant/payment.constant';
import { TimeZone } from '@common/constant/timezone.constant';
import { PaymentRequestDto } from '@common/dto/payment-request.dto';
import { AppResponseSuccessDto } from '@common/dto/response.dto';
import { DateFormat } from '@common/enum/date-format.enum';
import { PayOnlineType } from '@common/enum/pay-online-type.enum';
import { snakeCaseToCamelCase } from '@common/utils/utils';
import { HairStyleGrpcClientService } from '@grpc/services/hair-style/hair-style.grpc-client.service';
import { UserGrpcClientService } from '@grpc/services/user/user.grpc-client.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  StatisticItemsRequestDto,
  StatisticRevenuesRequestDto,
} from '@payment/payment.dto';
import { PaymentStatus } from '@payment/payment.enum';
import { PaymentRepository } from '@payment/payment.repository';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { In } from 'typeorm';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly hairStyleGrpcClientService: HairStyleGrpcClientService,
    private readonly userGrpcClientService: UserGrpcClientService,
  ) {}

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
      hairStyleId: paymentRequestDto.hairStyleId,
      userId: paymentRequestDto.userId,
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

  async statisticItems(statisticItemsDto: StatisticItemsRequestDto) {
    let result: any = null;

    statisticItemsDto.item = `${statisticItemsDto.item}_id`;

    if (statisticItemsDto.filter === 'month') {
      if (
        new Date(`${statisticItemsDto.value}-01`).toString() === 'Invalid Date'
      ) {
        throw new BadRequestException({
          errors: [
            {
              field: statisticItemsDto.filter,
              message: `Invalid ${statisticItemsDto.filter}`,
              resource: 'StatisticItemsRequestDto',
            },
          ],
        });
      }
      result = await this.paymentRepository
        .createQueryBuilder('payment')
        .select(
          `payment.${statisticItemsDto.item}, sum(payment.amount) as total_amount`,
        )
        .where(
          'extract(month from payment.pay_time) = :month and extract(year from payment.pay_time) = :year',
          {
            year: +statisticItemsDto.value.split('-')[0],
            month: +statisticItemsDto.value.split('-')[1],
          },
        )
        .groupBy(`payment.${statisticItemsDto.item}`)
        .orderBy('sum(payment.amount)', 'DESC')
        .addOrderBy(`payment.${statisticItemsDto.item}`, 'ASC')
        .skip(0)
        .take(10)
        .getRawMany();
    } else if (statisticItemsDto.filter === 'year') {
      if (isNaN(+statisticItemsDto.value)) {
        throw new BadRequestException({
          errors: [
            {
              field: statisticItemsDto.filter,
              message: `Invalid ${statisticItemsDto.filter}`,
              resource: 'StatisticItemsRequestDto',
            },
          ],
        });
      }
      result = await this.paymentRepository
        .createQueryBuilder('payment')
        .select('payment.hair_style_id, sum(payment.amount) as total_amount')
        .where('extract(year from payment.pay_time) = :year', {
          year: +statisticItemsDto.value,
        })
        .groupBy(`payment.${statisticItemsDto.item}`)
        .orderBy('sum(payment.amount)', 'DESC')
        .addOrderBy(`payment.${statisticItemsDto.item}`, 'ASC')
        .skip(0)
        .take(10)
        .getRawMany();
    } else {
      const startDate = new Date(statisticItemsDto.value.split(',')[0].trim());
      const endDate = new Date(statisticItemsDto.value.split(',')[1].trim());
      if (
        startDate.toString() === 'Invalid Date' ||
        endDate.toString() === 'Invalid Date'
      ) {
        throw new BadRequestException({
          errors: [
            {
              field: statisticItemsDto.filter,
              message: `Invalid ${statisticItemsDto.filter} at: start date or end date`,
              resource: 'StatisticItemsRequestDto',
            },
          ],
        });
      }
      if (startDate.getTime() > endDate.getTime()) {
        throw new BadRequestException({
          errors: [
            {
              field: statisticItemsDto.filter,
              message: `Invalid ${statisticItemsDto.filter} at: start date must be less than or equal end date`,
              resource: 'StatisticItemsRequestDto',
            },
          ],
        });
      }
      result = await this.paymentRepository
        .createQueryBuilder('payment')
        .select(
          `payment.${statisticItemsDto.item}, sum(payment.amount) as total_amount`,
        )
        .where(
          `date(payment.pay_time) >= date(:startDate) and date(payment.pay_time) <= date(:endDate)`,
          {
            startDate: statisticItemsDto.value.split(',')[0].trim(),
            endDate: statisticItemsDto.value.split(',')[1].trim(),
          },
        )
        .groupBy(`payment.${statisticItemsDto.item}`)
        .orderBy('sum(payment.amount)', 'DESC')
        .addOrderBy(`payment.${statisticItemsDto.item}`, 'ASC')
        .skip(0)
        .take(10)
        .getRawMany();
    }

    if (statisticItemsDto.item === 'hair_style_id') {
      const hairStyles = (
        await this.hairStyleGrpcClientService.getListHairStyleByIds({
          ids: result.map((item: any) => item.hair_style_id),
        })
      ).hairStyles;

      return {
        data: {
          [snakeCaseToCamelCase(statisticItemsDto.item.replace('_id', '')) +
          's']: result.map((item: any) => {
            const hairStyle = hairStyles.find(
              (hs) => hs.id === item.hair_style_id,
            );
            return {
              id: hairStyle?.id,
              name: hairStyle?.name,
              totalAmount: +item.total_amount,
              img: hairStyle?.img,
            };
          }),
        },
      } as AppResponseSuccessDto;
    }

    const users = (
      await this.userGrpcClientService.getListUserByIds({
        ids: result.map((item: any) => item.user_id),
      })
    ).users;

    return {
      data: {
        [snakeCaseToCamelCase(statisticItemsDto.item.replace('_id', '')) + 's']:
          result.map((item: any) => {
            const user = users.find((u) => u.id === item.user_id);
            return {
              id: user?.id,
              username: user?.username,
              email: user?.email,
              totalAmount: +item.total_amount,
              avatar: user?.avatar,
            };
          }),
      },
    } as AppResponseSuccessDto;
  }

  async statisticRevenues(
    statisticRevenuesRequestDto: StatisticRevenuesRequestDto,
  ) {
    let result: any = null;

    if (statisticRevenuesRequestDto.filter === 'month') {
      if (
        new Date(`${statisticRevenuesRequestDto.value}-01`).toString() ===
        'Invalid Date'
      ) {
        throw new BadRequestException({
          errors: [
            {
              field: statisticRevenuesRequestDto.filter,
              message: `Invalid ${statisticRevenuesRequestDto.filter}`,
              resource: 'StatisticItemsRequestDto',
            },
          ],
        });
      }
      result = await this.paymentRepository
        .createQueryBuilder('payment')
        .select(
          `date(payment.pay_time) as date, sum(payment.amount) as total_amount`,
        )
        .where(
          'extract(month from payment.pay_time) = :month and extract(year from payment.pay_time) = :year',
          {
            year: +statisticRevenuesRequestDto.value.split('-')[0],
            month: +statisticRevenuesRequestDto.value.split('-')[1],
          },
        )
        .groupBy(`date(payment.pay_time)`)
        .orderBy('date(payment.pay_time)', 'ASC')
        .getRawMany();
    } else if (statisticRevenuesRequestDto.filter === 'year') {
      if (isNaN(+statisticRevenuesRequestDto.value)) {
        throw new BadRequestException({
          errors: [
            {
              field: statisticRevenuesRequestDto.filter,
              message: `Invalid ${statisticRevenuesRequestDto.filter}`,
              resource: 'StatisticItemsRequestDto',
            },
          ],
        });
      }
      result = await this.paymentRepository
        .createQueryBuilder('payment')
        .select(
          'extract(month from payment.pay_time) as month, sum(payment.amount) as total_amount',
        )
        .where('extract(year from payment.pay_time) = :year', {
          year: +statisticRevenuesRequestDto.value,
        })
        .groupBy(`extract(month from payment.pay_time)`)
        .orderBy('extract(month from payment.pay_time)', 'ASC')
        .getRawMany();
    } else {
      const startDate = new Date(
        statisticRevenuesRequestDto.value.split(',')[0].trim(),
      );
      const endDate = new Date(
        statisticRevenuesRequestDto.value.split(',')[1].trim(),
      );
      if (
        startDate.toString() === 'Invalid Date' ||
        endDate.toString() === 'Invalid Date'
      ) {
        throw new BadRequestException({
          errors: [
            {
              field: statisticRevenuesRequestDto.filter,
              message: `Invalid ${statisticRevenuesRequestDto.filter} at: start date or end date`,
              resource: 'StatisticItemsRequestDto',
            },
          ],
        });
      }
      if (startDate.getTime() > endDate.getTime()) {
        throw new BadRequestException({
          errors: [
            {
              field: statisticRevenuesRequestDto.filter,
              message: `Invalid ${statisticRevenuesRequestDto.filter} at: start date must be less than or equal end date`,
              resource: 'StatisticItemsRequestDto',
            },
          ],
        });
      }
      if (
        endDate.getTime() - startDate.getTime() <
          MIN_DURATION_STATISTIC_REVENUE ||
        endDate.getTime() - startDate.getTime() > MAX_DURATION_STATISTIC_REVENUE
      ) {
        throw new BadRequestException({
          errors: [
            {
              field: statisticRevenuesRequestDto.filter,
              message: `Invalid ${statisticRevenuesRequestDto.filter}: duration must be between 12 and 20 days`,
              resource: 'StatisticItemsRequestDto',
            },
          ],
        });
      }
      result = await this.paymentRepository
        .createQueryBuilder('payment')
        .select(
          `date(payment.pay_time) as date, sum(payment.amount) as total_amount`,
        )
        .where(
          `date(payment.pay_time) >= date(:startDate) and date(payment.pay_time) <= date(:endDate)`,
          {
            startDate: statisticRevenuesRequestDto.value.split(',')[0].trim(),
            endDate: statisticRevenuesRequestDto.value.split(',')[1].trim(),
          },
        )
        .groupBy(`date(payment.pay_time)`)
        .orderBy('date(payment.pay_time)', 'ASC')
        .getRawMany();
    }

    return {
      data: {
        revenues: result.map((item: any) => {
          const key =
            statisticRevenuesRequestDto.filter === 'year' ? 'month' : 'date';
          return {
            ...item,
            totalAmount: +item.total_amount,
            [key]:
              key === 'date'
                ? dayjs(new Date(item[key]))
                    .tz(TimeZone.ASIA_HCM)
                    .format(DateFormat.YYYY_MM_DD)
                : MonthMeaning[+item[key]],
            total_amount: undefined,
          };
        }),
      },
    } as AppResponseSuccessDto;
  }
}
