import { Gender } from '@barber/barber-gender.enum';
import {
  MAX_LENGTH_100,
  MAX_LENGTH_50,
  MAX_LENGTH_500,
  MAX_VALUE_40,
  MIN_LENGTH_1,
  MIN_VALUE_18,
  MIN_VALUE_ID,
} from '@common/constant/validate.constant';
import { PaginationDto } from '@common/dto/request.dto';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
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

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class SaveBarberRequestDto {
  @Transform(({ value }) => +value)
  @IsOptional()
  @IsInt()
  @Min(MIN_VALUE_ID)
  id: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_LENGTH_1)
  @MaxLength(MAX_LENGTH_50)
  name: string;

  @Transform(({ value }) => +value)
  @IsNotEmpty()
  @IsInt()
  @Min(MIN_VALUE_18)
  @Max(MAX_VALUE_40)
  age: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_LENGTH_1)
  @MaxLength(MAX_LENGTH_500)
  description: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: string;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}
