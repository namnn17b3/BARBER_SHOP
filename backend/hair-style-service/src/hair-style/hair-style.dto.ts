import {
  HAIR_STYLE_MAX_PRICE,
  HAIR_STYLE_MIN_PRICE,
  HAIR_STYLE_SORTING,
} from '@common/constant/hair-style.constant';
import {
  MAX_LENGTH_50,
  MAX_LENGTH_500,
  MIN_LENGTH_1,
  MIN_VALUE_1,
  MIN_VALUE_ID,
} from '@common/constant/validate.constant';
import { PaginationDto } from '@common/dto/request.dto';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
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

  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return '';
  })
  @IsOptional()
  @IsBoolean()
  active: boolean;
}

export class GetListImageUrlRequestDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;
}

export class DisCountDto {
  @IsNotEmpty()
  @IsInt()
  @Min(MIN_VALUE_1)
  value: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['%', 'VNĐ'])
  unit: string;
}

export class FileRequire {
  @IsNotEmpty()
  @IsBoolean()
  img1: boolean;

  @IsNotEmpty()
  @IsBoolean()
  img2: boolean;

  @IsNotEmpty()
  @IsBoolean()
  img3: boolean;

  @IsNotEmpty()
  @IsBoolean()
  img4: boolean;

  @IsNotEmpty()
  @IsBoolean()
  img5: boolean;
}

export class SaveHairStyleRequestDto {
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

  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_LENGTH_1)
  @MaxLength(MAX_LENGTH_500)
  description: string;

  @Transform(({ value }) => +value)
  @IsNotEmpty()
  @IsInt()
  @Min(HAIR_STYLE_MIN_PRICE)
  @Max(HAIR_STYLE_MAX_PRICE)
  price: number;

  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return '';
  })
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  imgs: { id: number; url: string }[];

  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return '';
  })
  @IsNotEmpty()
  @IsBoolean()
  isDiscount: boolean;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  @ValidateIf((o) => o.isDiscount)
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => DisCountDto)
  discount: DisCountDto;

  requestMethod: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  @ValidateIf((o) => o.requestMethod === 'PUT')
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  fileRequire: FileRequire;
}
