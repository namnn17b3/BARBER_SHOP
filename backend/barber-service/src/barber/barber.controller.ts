import { GetListBarberRequestDto } from '@barber/barber-request.dto';
import { BarberService } from '@barber/barber.service';
import { FormattedParseIntPipe } from '@common/validate-pipe/formatted-parse-int.pipe';
import { FormattedValidationPipe } from '@common/validate-pipe/formatted-validation.pipe';
import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('/api/barbers')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @Get()
  async getAll(
    @Query(new FormattedValidationPipe('GetListBarberRequestDto'))
    getListBarberRequestDto: GetListBarberRequestDto,
  ) {
    return await this.barberService.getAll(getListBarberRequestDto);
  }

  @Get('/:id')
  getDetail(
    @Param('id', new FormattedParseIntPipe('BarberId', 'id')) id: number,
  ) {
    return this.barberService.getDetail(id);
  }
}
