// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.180.0
//   protoc               v3.20.3
// source: src/grpc/protos/hair-style/hair-style.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "hairStyle";

export interface Discount {
  unit: string;
  value: number;
}

export interface HairStyle {
  id: number;
  name: string;
  price: number;
  active: boolean;
  discount?: Discount | undefined;
  img?: string | undefined;
}

export interface GetListHairStyleByIdsRequest {
  ids: number[];
}

export interface GetListHairStyleByIdsResponse {
  hairStyles: HairStyle[];
}

export const HAIR_STYLE_PACKAGE_NAME = "hairStyle";

export interface HairStyleServiceClient {
  getListHairStyleByIds(request: GetListHairStyleByIdsRequest): Observable<GetListHairStyleByIdsResponse>;
}

export interface HairStyleServiceController {
  getListHairStyleByIds(
    request: GetListHairStyleByIdsRequest,
  ): Promise<GetListHairStyleByIdsResponse> | Observable<GetListHairStyleByIdsResponse> | GetListHairStyleByIdsResponse;
}

export function HairStyleServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getListHairStyleByIds"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("HairStyleService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("HairStyleService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const HAIR_STYLE_SERVICE_NAME = "HairStyleService";
