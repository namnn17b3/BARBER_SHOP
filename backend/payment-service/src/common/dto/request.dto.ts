import {
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
  MIN_PAGE_ITEMS,
} from '@common/constant/pagination.constant';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Min(MIN_PAGE_ITEMS)
  @Transform(({ value }) => Number(value))
  readonly page?: number = DEFAULT_PAGE;

  @IsNumber()
  @IsOptional()
  @Min(MIN_PAGE_ITEMS)
  @Transform(({ value }) => Number(value))
  readonly items?: number = DEFAULT_PER_PAGE;
}
