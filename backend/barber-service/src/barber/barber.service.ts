import {
  GetListBarberRequestDto,
  SaveBarberRequestDto,
} from '@barber/barber-request.dto';
import { BarberRepository } from '@barber/barber.repository';
import {
  AppResponseSuccessDto,
  PaginationResponseDto,
} from '@common/dto/response.dto';
import { Operators } from '@common/enum/operators.enum';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  GetAllBarberRequest,
  GetDetailBarberRequest,
  GetDetailBarberResponse,
} from '@protos/barber';
import * as grpc from '@grpc/grpc-js';
import { ConfigService } from '@nestjs/config';
import { S3GrpcClientService } from '@grpc/services/s3/s3.grpc-client.service';
import { DeleteFileRequest, UploadFileRequest } from '@grpc/protos/s3/s3';

@Injectable()
export class BarberService {
  constructor(
    private readonly barberRepository: BarberRepository,
    private readonly s3GrpcClientService: S3GrpcClientService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(getListBarberRequestDto: GetListBarberRequestDto, user?: any) {
    this.barberRepository.resetQueryBuilder();
    let barberRepositoryBuilder = this.barberRepository;

    if (user?.role?.toLowerCase() !== 'admin') {
      barberRepositoryBuilder = this.barberRepository.filterByField(
        'active',
        true,
        Operators.Eq,
      );
    } else {
      barberRepositoryBuilder = this.barberRepository.filterByField(
        'active',
        getListBarberRequestDto.active === true ||
          getListBarberRequestDto.active === false
          ? getListBarberRequestDto.active
          : undefined,
        Operators.Eq,
      );
    }

    const [barbers, totalRecords] = await barberRepositoryBuilder
      .filterByField(
        'name',
        getListBarberRequestDto.name ? getListBarberRequestDto.name : undefined,
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

  async getDetail(id: number, user?: any) {
    let barber = null;

    if (user?.role?.toLowerCase() !== 'admin') {
      barber = await this.barberRepository.findOneBy({ id, active: true });
    } else {
      barber = await this.barberRepository.findOneBy({ id });
    }

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

  async createNewBarber(
    saveBarberRequest: SaveBarberRequestDto,
    file: Express.Multer.File,
  ) {
    return await this.saveBarber(saveBarberRequest, file);
  }

  async updateBarber(
    saveBarberRequest: SaveBarberRequestDto,
    file: Express.Multer.File,
  ) {
    const barber = await this.barberRepository.findOneBy({
      id: saveBarberRequest.id,
    });
    if (!barber) {
      throw new NotFoundException('Barber not found');
    }

    (saveBarberRequest as any).img = barber.img;

    if (file) {
      await this.s3GrpcClientService.deleteFile({
        url: barber.img,
      } as DeleteFileRequest);
    }

    return await this.saveBarber(saveBarberRequest, file);
  }

  private async saveBarber(
    saveBarberRequest: SaveBarberRequestDto,
    file: Express.Multer.File,
  ) {
    let img = (saveBarberRequest as any).img;
    if (file) {
      const folderName = this.configService.get('AWS_S3_PUBLIC_FOLDER');
      img = (
        await this.s3GrpcClientService.uploadFile({
          folderName,
          originalFileName: file.originalname,
          data: file.buffer,
        } as UploadFileRequest)
      ).url;
    }
    const barber = await this.barberRepository.save({
      ...saveBarberRequest,
      img,
    });

    return {
      data: {
        ...barber,
        createdAt: undefined,
        updatedAt: undefined,
      },
    } as AppResponseSuccessDto;
  }
}
