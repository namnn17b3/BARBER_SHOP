import {
  FEED_BACK_SORTING,
  MAX_STAR_RATING,
  MIN_ID_VALUE,
  MIN_STAR_RATING,
} from '@common/constant/feedback.constant';
import {
  MAX_LENGTH_500,
  MIN_LENGTH_1,
} from '@common/constant/validate.constant';
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
  MaxLength,
  Min,
  MinLength,
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

export class SaveFeedbackRequestDto {
  @IsOptional()
  @IsInt()
  @Min(MIN_ID_VALUE)
  id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(MAX_LENGTH_500)
  @MinLength(MIN_LENGTH_1)
  comment: string;

  @IsNotEmpty()
  @IsInt()
  @Min(MIN_STAR_RATING)
  @Max(MAX_STAR_RATING)
  star: number;

  @IsOptional()
  @IsInt()
  @Min(MIN_ID_VALUE)
  orderId: number;

  time: string;

  hairStyleId: number;

  user: any;
}
