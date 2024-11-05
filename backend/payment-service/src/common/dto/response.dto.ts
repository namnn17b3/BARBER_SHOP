export interface AppResponseSuccessDto {
  data: any;
}

export interface AppResponseErrorDto {
  status: number;
  message: string;
  errors: any;
}

export interface PaginationMeta {
  totalRecords: number;
  page: number;
  items: number;
}

export interface PaginationResponseDto extends AppResponseSuccessDto {
  meta: PaginationMeta;
}

export interface FieldError {
  resource: string;
  field: string;
  message: string;
}

export interface FieldErrorsResponseDto {
  errors: FieldError[];
}

export interface ImportResponseDto {
  errors: FieldError[];
  data: any;
}
