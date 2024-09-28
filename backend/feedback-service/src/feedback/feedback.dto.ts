import {
  FEED_BACK_SORTING,
  MAX_STAR_RATING,
  MIN_ID_VALUE,
  MIN_STAR_RATING,
} from '@common/constant/feedback.constant';
import { PaginationDto } from '@common/dto/request.dto';
import { IsBefore } from '@common/validators/is-before';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class GetListFeedbackRequestByHairStyleDto extends PaginationDto {
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(MIN_ID_VALUE)
  hairStyleId: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(MIN_STAR_RATING)
  @Max(MAX_STAR_RATING)
  minStar: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(MIN_STAR_RATING)
  @Max(MAX_STAR_RATING)
  maxStar: number;

  @IsOptional()
  @IsDateString()
  @IsBefore('endDate')
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  @Matches(FEED_BACK_SORTING)
  sorting: string;
}
