// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.180.0
//   protoc               v3.20.3
// source: src/grpc/protos/user/user.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface CheckAuthenRequest {
  token: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  role: string;
  gender: string;
}

export interface CheckAuthenResponse {
  user: User | undefined;
}

export interface GetListUserByIdsRequest {
  ids: number[];
}

export interface GetListUserByIdsResponse {
  users: User[];
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  checkAuthen(request: CheckAuthenRequest): Observable<CheckAuthenResponse>;

  getListUserByIds(request: GetListUserByIdsRequest): Observable<GetListUserByIdsResponse>;
}

export interface UserServiceController {
  checkAuthen(
    request: CheckAuthenRequest,
  ): Promise<CheckAuthenResponse> | Observable<CheckAuthenResponse> | CheckAuthenResponse;

  getListUserByIds(
    request: GetListUserByIdsRequest,
  ): Promise<GetListUserByIdsResponse> | Observable<GetListUserByIdsResponse> | GetListUserByIdsResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["checkAuthen", "getListUserByIds"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";