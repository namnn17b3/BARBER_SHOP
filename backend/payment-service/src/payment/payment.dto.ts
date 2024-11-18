import {
  STATISTIC_ITEMS_FILTER_REGEX,
  STATISTIC_ITEMS_ITEM_REGEX,
} from '@common/constant/payment.constant';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { OmitType } from '@nestjs/swagger';

export class StatisticItemsRequestDto {
  @IsNotEmpty()
  @IsString()
  @Matches(STATISTIC_ITEMS_ITEM_REGEX)
  item: string;

  @IsNotEmpty()
  @IsString()
  @Matches(STATISTIC_ITEMS_FILTER_REGEX)
  filter: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}

export class StatisticRevenuesRequestDto extends OmitType(
  StatisticItemsRequestDto,
  ['item'],
) {}
