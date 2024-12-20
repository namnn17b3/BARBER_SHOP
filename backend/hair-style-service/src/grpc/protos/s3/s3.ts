// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.180.0
//   protoc               v3.20.3
// source: src/grpc/protos/s3/s3.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "s3";

export interface UploadFileRequest {
  data: Uint8Array;
  folderName: string;
  originalFileName: string;
}

export interface UploadFileResponse {
  url: string;
}

export interface DeleteFileRequest {
  url: string;
}

export interface DeleteFileResponse {
  message: string;
}

export interface FileRequest {
  index: number;
  data: Uint8Array;
  folderName: string;
  originalFileName: string;
}

export interface UploadFilesRequest {
  fileRequest: FileRequest[];
}

export interface UploadFilesResult {
  index: number;
  url: string;
}

export interface UploadFilesResponse {
  results: UploadFilesResult[];
}

export interface DeleteFileInfo {
  index: number;
  url: string;
}

export interface DeleteFilesRequest {
  deleteFileInfos: DeleteFileInfo[];
}

export interface DeleteFilesResult {
  index: number;
  message: string;
}

export interface DeleteFilesResponse {
  results: DeleteFilesResult[];
}

export const S3_PACKAGE_NAME = "s3";

export interface S3ServiceClient {
  uploadFile(request: UploadFileRequest): Observable<UploadFileResponse>;

  deleteFile(request: DeleteFileRequest): Observable<DeleteFileResponse>;

  uploadFiles(request: UploadFilesRequest): Observable<UploadFilesResponse>;

  deleteFiles(request: DeleteFilesRequest): Observable<DeleteFilesResponse>;
}

export interface S3ServiceController {
  uploadFile(
    request: UploadFileRequest,
  ): Promise<UploadFileResponse> | Observable<UploadFileResponse> | UploadFileResponse;

  deleteFile(
    request: DeleteFileRequest,
  ): Promise<DeleteFileResponse> | Observable<DeleteFileResponse> | DeleteFileResponse;

  uploadFiles(
    request: UploadFilesRequest,
  ): Promise<UploadFilesResponse> | Observable<UploadFilesResponse> | UploadFilesResponse;

  deleteFiles(
    request: DeleteFilesRequest,
  ): Promise<DeleteFilesResponse> | Observable<DeleteFilesResponse> | DeleteFilesResponse;
}

export function S3ServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["uploadFile", "deleteFile", "uploadFiles", "deleteFiles"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("S3Service", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("S3Service", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const S3_SERVICE_NAME = "S3Service";
