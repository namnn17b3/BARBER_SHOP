import { GetListBarberRequestDto } from '@barber/barber-request.dto';
import { BarberRepository } from '@barber/barber.repository';
import { PaginationResponseDto } from '@common/dto/response.dto';
import { Operators } from '@common/enum/operators.enum';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  GetAllBarberRequest,
  GetDetailBarberRequest,
  GetDetailBarberResponse,
} from '@protos/barber';
import * as grpc from '@grpc/grpc-js';

@Injectable()
export class BarberService {
  constructor(private readonly barberRepository: BarberRepository) {}

  async getAll(getListBarberRequestDto: GetListBarberRequestDto) {
    this.barberRepository.resetQueryBuilder();
    const [barbers, totalRecords] = await this.barberRepository
      .filterByField('active', true, Operators.Eq)
      .filterByField(
        'name',
        getListBarberRequestDto.name
          ? `%${getListBarberRequestDto.name}%`
          : undefined,
        Operators.Like,
      )
      .filterByField(
        'age',
        getListBarberRequestDto.ageMin,
        Operators.Gteq,
        'ageMin',
      )
      .filterByField(
        'age',
        getListBarberRequestDto.ageMax,
        Operators.Lteq,
        'ageMax',
      )
      .filterByField('gender', getListBarberRequestDto.gender, Operators.Eq)
      .pagy({
        page: getListBarberRequestDto.page,
        items: getListBarberRequestDto.items,
      })
      .getQueryBuilder()
      .getManyAndCount();

    return {
      data: barbers.map((item) => ({
        ...item,
        createdAt: undefined,
        updatedAt: undefined,
      })),
      meta: {
        items: getListBarberRequestDto.items,
        page: getListBarberRequestDto.page,
        totalRecords,
      },
    } as PaginationResponseDto;
  }

  async getDetail(id: number) {
    const barber = await this.barberRepository.findOneBy({ id });
    if (!barber) {
      throw new NotFoundException('Barber not found');
    }

    return {
      data: {
        ...barber,
        updatedAt: undefined,
        createdAt: undefined,
      },
    };
  }

  async getAllBarberNoPagination(request: GetAllBarberRequest) {
    const barbers = await this.barberRepository.find();
    return {
      data: barbers.map((item) => ({
        ...item,
        createdAt: undefined,
        updatedAt: undefined,
        gender: item.gender.toString(),
      })),
    };
  }

  async getDetailGrpc(request: GetDetailBarberRequest) {
    const barber = await this.barberRepository.findOneBy({ id: request.id });
    if (!barber) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'Barber not found',
      });
    }

    return {
      barber: barber,
    } as GetDetailBarberResponse;
  }
}
