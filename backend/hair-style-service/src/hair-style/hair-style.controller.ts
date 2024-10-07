import { FormattedParseIntPipe } from '@common/validate-pipe/formatted-parse-int.pipe';
import { FormattedValidationPipe } from '@common/validate-pipe/formatted-validation.pipe';
import {
  GetListHairStyleRequestDto,
  GetListImageUrlRequestDto,
} from '@hair-style/hair-style.dto';
import { HairStyleService } from '@hair-style/hair-style.service';
import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('/api/hair-styles')
export class HairStyleController {
  constructor(private readonly hairStyleService: HairStyleService) {}

  @Get()
  getAll(
    @Query(new FormattedValidationPipe('GetListHairStyleRequestDto'))
    query: GetListHairStyleRequestDto,
  ) {
    return this.hairStyleService.getAll(query);
  }

  @Get('/image-url')
  getListImageUrl(
    @Query(new FormattedValidationPipe('GetListImageUrlRequestDto'))
    query: GetListImageUrlRequestDto,
  ) {
    return this.hairStyleService.getListImageUrl(query);
  }

  @Get('/seed')
  seed(@Query() query: any) {
    return this.hairStyleService.seed(query);
  }

  @Get('/:id')
  getDetail(
    @Param('id', new FormattedParseIntPipe('HairStyleId', 'id'))
    id: number,
  ) {
    return this.hairStyleService.getDetail(id);
  }
}
