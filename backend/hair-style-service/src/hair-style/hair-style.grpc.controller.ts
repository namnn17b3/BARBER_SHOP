import { HairStyle } from '@hair-style/hair-style.model';
import { Controller } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import {
  GetDetailHairStyleRequest,
  GetDetailHairStyleResponse,
  HairStyleServiceController,
  HairStyleServiceControllerMethods,
} from '@protos/hair-style';
import { Model } from 'mongoose';
import * as grpc from '@grpc/grpc-js';

@HairStyleServiceControllerMethods()
@Controller()
export class HairStyleGrpcController implements HairStyleServiceController {
  constructor(
    @InjectModel('HairStyle') private readonly hairStyleModel: Model<HairStyle>,
  ) {}
  async getDetailHairStyle(request: GetDetailHairStyleRequest) {
    const hairStyle = await this.hairStyleModel.findOne({ id: request.id });
    if (!hairStyle) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
      });
    }

    return {
      hairStyle: {
        id: hairStyle.id,
        name: hairStyle.name,
        active: hairStyle.active,
        discount: hairStyle.discount?.value
          ? {
              value: hairStyle.discount?.value,
              unit: hairStyle.discount?.unit,
            }
          : undefined,
        price: hairStyle.price,
      },
    } as GetDetailHairStyleResponse;
  }
}
