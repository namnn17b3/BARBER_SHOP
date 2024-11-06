import { BarberService } from '@barber/barber.service';
import { Controller } from '@nestjs/common';
import {
  BarberServiceController,
  BarberServiceControllerMethods,
  GetAllBarberRequest,
  GetDetailBarberRequest,
} from '@protos/barber';

@BarberServiceControllerMethods()
@Controller()
export class BarberGrpcController implements BarberServiceController {
  constructor(private readonly barberService: BarberService) {}

  getAllBarber(request: GetAllBarberRequest) {
    return this.barberService.getAllBarberNoPagination(request);
  }

  getDetailBarber(request: GetDetailBarberRequest) {
    return this.barberService.getDetailGrpc(request);
  }
}
