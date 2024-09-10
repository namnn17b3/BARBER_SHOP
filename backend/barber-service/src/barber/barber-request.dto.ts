import { Gender } from '@barber/barber-gender.enum';
import {
  MAX_LENGTH_100,
  MAX_VALUE_40,
  MIN_LENGTH_1,
  MIN_VALUE_18,
} from '@common/constant/validate.constant';
import { PaginationDto } from '@common/dto/request.dto';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class GetListBarberRequestDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MinLength(MIN_LENGTH_1)
  @MaxLength(MAX_LENGTH_100)
  name?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => +value)
  @Min(MIN_VALUE_18)
  @Max(MAX_VALUE_40)
  ageMin?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => +value)
  @Min(MIN_VALUE_18)
  @Max(MAX_VALUE_40)
  ageMax?: number;

  @IsOptional()
  @IsString()
  @IsEnum(Gender)
  gender?: Gender;
}
