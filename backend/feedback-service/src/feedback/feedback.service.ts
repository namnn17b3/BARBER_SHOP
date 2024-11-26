import { DateFormatType } from '@common/constant/date-format.constant';
import { FEED_BACK_DURATION } from '@common/constant/feedback.constant';
import { TimeZone } from '@common/constant/timezone.constant';
import {
  AppResponseSuccessDto,
  PaginationResponseDto,
} from '@common/dto/response.dto';
import { Operators } from '@common/enum/operators.enum';
import { objectMapper } from '@common/utils/utils';
import {
  GetListFeedbackRequestByHairStyleDto,
  SaveFeedbackRequestDto,
} from '@feedback/feedback.dto';
import { FeedbackRepository } from '@feedback/feedback.repository';
import { UserFeedback } from '@grpc/protos/order/order';
import { OrderGrpcClientService } from '@grpc/services/order/order.grpc-client.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  GetListHairStyleRequest,
  GetListHairStyleResponse,
} from '@protos/feedback';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly orderGrpcClientService: OrderGrpcClientService,
  ) {}

  async getListHairStyles(
    request: GetListHairStyleRequest,
  ): Promise<GetListHairStyleResponse> {
    const queryBuilder = this.feedbackRepository.createQueryBuilder('feedback');
    const result = await queryBuilder
      .select(
        'hair_style_id, cast(cast(sum(star) as decimal(10,2)) / cast(count(hair_style_id) as decimal(10,2)) as decimal(10,1)) as rating',
      )
      .where(`hair_style_id in (${request.ids.join(',')})`)
      .groupBy('hair_style_id')
      .orderBy('hair_style_id', 'ASC')
      .getRawMany();

    return {
      hairStyles: result.map((item) => ({
        id: item.hair_style_id,
        rating: item.rating,
      })),
    };
  }

  async getListFeedbackByHairStyle(
    query: GetListFeedbackRequestByHairStyleDto,
  ) {
    const {
      hairStyleId,
      startDate,
      endDate,
      minStar,
      maxStar,
      sorting,
      page,
      items,
    } = query;

    const userId = query['user']?.id;
    let orderIds: number[] = [];
    if (userId) {
      orderIds =
        (
          await this.orderGrpcClientService.getListOrderByUserId({
            userId,
          })
        )?.orderIds || [];
    }

    this.feedbackRepository.resetQueryBuilder('feedback');
    const builder = this.feedbackRepository
      .filterByField('hair_style_id', hairStyleId, Operators.Eq)
      .filterByField(
        'time',
        startDate ? new Date(startDate) : undefined,
        Operators.Gteq,
      )
      .filterByField(
        'time',
        endDate ? new Date(endDate) : undefined,
        Operators.Lteq,
      )
      .filterByField('star', minStar, Operators.Gteq, 'minStar')
      .filterByField('star', maxStar, Operators.Lteq, 'maxStar')
      .filterByInOperator('order_id', orderIds)
      .pagy({ page, items });

    const sortingObject = this.makeSortingObject(sorting);
    if (sortingObject) {
      const fields =
        sortingObject['priority'] === 'rating'
          ? ['star', 'time']
          : sortingObject['priority'] === 'date'
            ? ['time', 'star']
            : ['star', 'time'];
      for (const field of fields) {
        if (sortingObject[field] !== 'none')
          builder.sortByField(field, sortingObject[field].toUpperCase());
      }
    }

    const [result, totalRecords] = await builder
      .getQueryBuilder()
      .getManyAndCount();
    const userFeedbacks =
      (
        await this.orderGrpcClientService.getListUserFeedbackByOrderIds({
          orderIds: result.map((item) => item.orderId),
        })
      )?.userFeedbacks || [];

    return {
      data: result.map((item) => {
        const userFeedback = userFeedbacks.find(
          (user: UserFeedback) => user.orderId === item.orderId,
        );
        userFeedback.hairColor = userFeedback.hairColor
          ? JSON.parse(userFeedback.hairColor)
          : null;
        return {
          ...objectMapper(['star', 'comment'], item),
          time: dayjs
            .utc(item.time)
            .tz(TimeZone.ASIA_HCM)
            .format(DateFormatType.YYYY_MM_DD_HH_MM_SS),
          user: userFeedback,
        };
      }),
      meta: {
        items,
        page,
        totalRecords,
      },
    } as PaginationResponseDto;
  }

  async getFeedbackStatisticsInfo(hairStyleId: number) {
    this.feedbackRepository.resetQueryBuilder('feedback');
    const result = await this.feedbackRepository
      .getQueryBuilder()
      .select('star, count(star) as reviews')
      .where('hair_style_id = :hairStyleId', { hairStyleId })
      .groupBy('star')
      .orderBy('star', 'ASC')
      .getRawMany();

    return {
      data: [1, 2, 3, 4, 5].map((star) => ({
        star,
        reviews: +result.find((item) => item.star === star)?.reviews || 0,
      })),
    } as AppResponseSuccessDto;
  }

  private makeSortingObject(sorting: string) {
    if (!sorting) return null;

    const p1 = sorting.split(',');
    const obj = {};
    for (const p2 of p1) {
      const p3 = p2.split(':');
      obj[p3[0]] = p3[1];
    }
    return obj;
  }

  async getFeedbackByOrderId(orderId: number, user: any) {
    const [feedback, isMatchWithUser] = await Promise.all([
      this.feedbackRepository.findOne({
        where: { orderId },
      }),
      this.orderGrpcClientService.checkOrderMatchWithUser({
        orderId,
        userId: user.id,
      }),
    ]);

    if (!isMatchWithUser.isMatch && user.role.toLowerCase() === 'user') {
      throw new NotFoundException('Order does not match with user');
    }

    return {
      data: feedback
        ? {
            ...objectMapper(['id', 'star', 'comment'], feedback),
            time: dayjs
              .utc(feedback.time)
              .tz(TimeZone.ASIA_HCM)
              .format(DateFormatType.YYYY_MM_DD_HH_MM_SS),
          }
        : null,
    } as AppResponseSuccessDto;
  }

  private async checkOrderMatchWithUser(orderId: number, user: any) {
    const order = await this.orderGrpcClientService.getOrderById({
      id: orderId,
    });
    if (order.userId !== user.id) {
      throw new ForbiddenException('Order does not match with user');
    }
    return order;
  }

  private async checkValidSaveFeedbackRequestValid(orderId: number, user: any) {
    const order = await this.checkOrderMatchWithUser(orderId, user);

    if (!order?.cutted) {
      throw new ForbiddenException('Cannot review order before using service');
    }

    const now = Date.now();
    const schedule = new Date(order?.schedule).getTime();
    if (now < schedule || now > schedule + FEED_BACK_DURATION) {
      throw new ForbiddenException(
        'Can only review the service within 3 days of your using service',
      );
    }

    return order;
  }

  private async checkFeedbackExist(id: number) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
    });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    return feedback;
  }

  private async saveFeedback(saveFeedbackRequestDto: SaveFeedbackRequestDto) {
    if (saveFeedbackRequestDto.user.role.toLowerCase() === 'admin') {
      throw new ForbiddenException('Cannot review by admin');
    }

    return await this.feedbackRepository.save(saveFeedbackRequestDto);
  }

  async createNewFeedback(saveFeedbackRequestDto: SaveFeedbackRequestDto) {
    const order = await this.checkValidSaveFeedbackRequestValid(
      saveFeedbackRequestDto.orderId,
      saveFeedbackRequestDto.user,
    );
    let feedback = await this.feedbackRepository.findOne({
      where: {
        orderId: saveFeedbackRequestDto.orderId,
      },
    });
    if (feedback) {
      throw new ForbiddenException(
        'Cannot review order because feedback already exists',
      );
    }

    const time = dayjs(new Date())
      .utc()
      .tz(TimeZone.ASIA_HCM)
      .format(DateFormatType.YYYY_MM_DD_HH_MM_SS);

    feedback = await this.saveFeedback({
      ...saveFeedbackRequestDto,
      hairStyleId: JSON.parse(order.hairStyle).id,
      time,
    });

    return {
      data: {
        message: 'Create feedback successfully',
        feedback: {
          id: feedback?.id,
          star: feedback?.star,
          comment: feedback?.comment,
          time,
        },
      },
    } as AppResponseSuccessDto;
  }

  async updateFeedback(saveFeedbackRequestDto: SaveFeedbackRequestDto) {
    let feedback = await this.checkFeedbackExist(saveFeedbackRequestDto.id);
    const order = await this.checkValidSaveFeedbackRequestValid(
      feedback.orderId,
      saveFeedbackRequestDto.user,
    );

    const time = dayjs(new Date())
      .utc()
      .tz(TimeZone.ASIA_HCM)
      .format(DateFormatType.YYYY_MM_DD_HH_MM_SS);

    feedback = await this.saveFeedback({
      ...saveFeedbackRequestDto,
      hairStyleId: JSON.parse(order.hairStyle).id,
      time,
    });

    return {
      data: {
        message: 'Update feedback successfully',
        feedback: {
          id: feedback?.id,
          star: feedback?.star,
          comment: feedback?.comment,
          time,
        },
      },
    } as AppResponseSuccessDto;
  }

  async deleteFeedback(id: number, user: any) {
    const feedback = await this.checkFeedbackExist(id);
    await this.checkOrderMatchWithUser(feedback.orderId, user);
    await this.feedbackRepository.delete(id);

    return {
      data: 'Delete feedback successfully',
    } as AppResponseSuccessDto;
  }
}
