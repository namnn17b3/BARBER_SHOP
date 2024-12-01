import {
  GetListBarberRequestDto,
  SaveBarberRequestDto,
} from '@barber/barber-request.dto';
import { BarberService } from '@barber/barber.service';
import {
  IMAGE_FILE_TYPE_JPEG,
  IMAGE_FILE_TYPE_JPG,
  IMAGE_FILE_TYPE_PNG,
  MAX_FILE_SIZE,
} from '@common/constant/validate.constant';
import { AdminGuard } from '@common/guards/admin.guards';
import { AddBarberIdToBodyInterceptor } from '@common/intercept/add-barber-id-to-body.intercept';
import { AddUserToBodyInterceptor } from '@common/intercept/add-user-to-body.intercept';
import { FileValidationPipe } from '@common/validate-pipe/file-validation.pipe';
import { FormattedParseIntPipe } from '@common/validate-pipe/formatted-parse-int.pipe';
import { FormattedValidationPipe } from '@common/validate-pipe/formatted-validation.pipe';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/barbers')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @UseInterceptors(AddUserToBodyInterceptor)
  @Get()
  async getAll(
    @Query(new FormattedValidationPipe('GetListBarberRequestDto'))
    getListBarberRequestDto: GetListBarberRequestDto,

    @Body('user') user: any,
  ) {
    return await this.barberService.getAll(getListBarberRequestDto, user);
  }

  @UseInterceptors(AddUserToBodyInterceptor)
  @Get('/:id')
  getDetail(
    @Param('id', new FormattedParseIntPipe('BarberId', 'id')) id: number,

    @Body('user') user: any,
  ) {
    return this.barberService.getDetail(id, user);
  }

  @UseInterceptors(FileInterceptor('img')) // img là tên file trong form data
  @UseGuards(AdminGuard)
  @Post('/admin')
  async createNewBarber(
    @Body(new FormattedValidationPipe('SaveBarberRequestDto'))
    saveBarberRequestDto: SaveBarberRequestDto,

    @UploadedFile(
      new FileValidationPipe(
        'img',
        [IMAGE_FILE_TYPE_JPEG, IMAGE_FILE_TYPE_JPG, IMAGE_FILE_TYPE_PNG],
        'POST',
        MAX_FILE_SIZE,
      ),
    )
    img: Express.Multer.File,
  ) {
    return this.barberService.createNewBarber(saveBarberRequestDto, img);
  }

  @UseInterceptors(FileInterceptor('img'), AddBarberIdToBodyInterceptor)
  @UseGuards(AdminGuard)
  @Put('/admin/:id')
  async updateBarber(
    @Body(new FormattedValidationPipe('SaveBarberRequestDto'))
    saveBarberRequestDto: SaveBarberRequestDto,

    @UploadedFile(
      new FileValidationPipe(
        'img',
        [IMAGE_FILE_TYPE_JPEG, IMAGE_FILE_TYPE_JPG, IMAGE_FILE_TYPE_PNG],
        'PUT',
        MAX_FILE_SIZE,
      ),
    )
    img: Express.Multer.File,
  ) {
    // console.log(saveBarberRequestDto);
    return this.barberService.updateBarber(saveBarberRequestDto, img);
  }
}
