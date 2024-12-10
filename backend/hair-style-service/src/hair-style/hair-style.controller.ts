import {
  IMAGE_FILE_TYPE_JPEG,
  IMAGE_FILE_TYPE_JPG,
  IMAGE_FILE_TYPE_PNG,
  MAX_FILE_SIZE,
  MAX_FILES_SIZE,
  NUMBER_OF_FILE_FIELD,
} from '@common/constant/validate.constant';
import { AdminGuard } from '@common/guards/admin.guards';
import { AddHairStyleIdToBodyInterceptor } from '@common/intercept/add-hair-style-id-to-body.intercept';
import { AddRequestBodyToBodyInterceptor } from '@common/intercept/add-request-method-to-body';
import { AddUserToBodyInterceptor } from '@common/intercept/add-user-to-body.intercept';
import { FileFiledsValidationPipe } from '@common/validate-pipe/file-fields-validation.pipe';
import { FormattedParseIntPipe } from '@common/validate-pipe/formatted-parse-int.pipe';
import { FormattedValidationPipe } from '@common/validate-pipe/formatted-validation.pipe';
import {
  GetListHairStyleRequestDto,
  GetListImageUrlRequestDto,
  SaveHairStyleRequestDto,
} from '@hair-style/hair-style.dto';
import { HairStyleService } from '@hair-style/hair-style.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('/api/hair-styles')
export class HairStyleController {
  constructor(private readonly hairStyleService: HairStyleService) {}

  @UseInterceptors(AddUserToBodyInterceptor)
  @Get()
  getAll(
    @Query(new FormattedValidationPipe('GetListHairStyleRequestDto'))
    query: GetListHairStyleRequestDto,

    @Body('user') user: any,
  ) {
    return this.hairStyleService.getAll(query, user);
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

  @UseInterceptors(AddUserToBodyInterceptor)
  @Get('/:id')
  getDetail(
    @Param('id', new FormattedParseIntPipe('HairStyleId', 'id'))
    id: number,

    @Body('user') user: any,
  ) {
    return this.hairStyleService.getDetail(id, user);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'img1' },
      { name: 'img2' },
      { name: 'img3' },
      { name: 'img4' },
      { name: 'img5' },
    ]),
    AddRequestBodyToBodyInterceptor,
  )
  @UseGuards(AdminGuard)
  @Post('/admin')
  createNewHairStyle(
    @Body(new FormattedValidationPipe('SaveHairStyleRequestDto'))
    saveHairStyleRequestDto: SaveHairStyleRequestDto,

    @UploadedFiles(
      new FileFiledsValidationPipe(
        ['img1', 'img2', 'img3', 'img4', 'img5'],
        [IMAGE_FILE_TYPE_JPEG, IMAGE_FILE_TYPE_JPG, IMAGE_FILE_TYPE_PNG],
        MAX_FILES_SIZE,
        NUMBER_OF_FILE_FIELD,
        'POST',
        MAX_FILE_SIZE,
      ),
    )
    imgs: Array<Express.Multer.File>,
  ) {
    return this.hairStyleService.createNewHairStyle(
      saveHairStyleRequestDto,
      imgs,
    );
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'img1' },
      { name: 'img2' },
      { name: 'img3' },
      { name: 'img4' },
      { name: 'img5' },
    ]),
    AddHairStyleIdToBodyInterceptor,
    AddRequestBodyToBodyInterceptor,
  )
  @UseGuards(AdminGuard)
  @Put('/admin/:id')
  updateHairStyle(
    @Body(new FormattedValidationPipe('SaveHairStyleRequestDto'))
    saveHairStyleRequestDto: SaveHairStyleRequestDto,

    @UploadedFiles(
      new FileFiledsValidationPipe(
        ['img1', 'img2', 'img3', 'img4', 'img5'],
        [IMAGE_FILE_TYPE_JPEG, IMAGE_FILE_TYPE_JPG, IMAGE_FILE_TYPE_PNG],
        MAX_FILES_SIZE,
        NUMBER_OF_FILE_FIELD,
        'PUT',
        MAX_FILE_SIZE,
      ),
    )
    imgs: Array<Express.Multer.File>,
  ) {
    return this.hairStyleService.updateHairStyle(saveHairStyleRequestDto, imgs);
  }
}
