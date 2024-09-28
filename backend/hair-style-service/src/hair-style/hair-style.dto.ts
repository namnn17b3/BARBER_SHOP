import {
  HAIR_STYLE_MAX_PRICE,
  HAIR_STYLE_MIN_PRICE,
  HAIR_STYLE_SORTING,
} from '@common/constant/hair-style.constant';
import { PaginationDto } from '@common/dto/request.dto';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class GetListHairStyleRequestDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(HAIR_STYLE_MIN_PRICE)
  @Max(HAIR_STYLE_MAX_PRICE)
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(HAIR_STYLE_MIN_PRICE)
  @Max(HAIR_STYLE_MAX_PRICE)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  @Matches(HAIR_STYLE_SORTING)
  sorting?: string;
}
