import { FieldErrorsResponseDto } from '@common/dto/response.dto';
import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { fromBuffer } from 'file-type';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private readonly fieldName: string,
    private readonly type: string[],
    private readonly requestMethod: string,
    private readonly maxFileSizeMb?: number,
  ) {}

  async transform(file: Express.Multer.File): Promise<Express.Multer.File> {
    if (!file && this.requestMethod === 'POST') {
      throw new BadRequestException({
        errors: [
          {
            resource: 'File Upload',
            field: this.fieldName,
            message: `Requested ${this.type.map((t: string) => t).join(', ')}`,
          },
        ],
      } as FieldErrorsResponseDto);
    }

    if (this.maxFileSizeMb) {
      const maxFileSizeByte = this.maxFileSizeMb * 1024 * 1024;
      const maxFileSizeKb = this.maxFileSizeMb * 1024;

      if (file && file.size > maxFileSizeByte) {
        throw new PayloadTooLargeException({
          errors: [
            {
              resource: 'File Upload',
              field: 'File',
              message: `File size must be less than ${maxFileSizeKb}kb`,
            },
          ],
        } as FieldErrorsResponseDto);
      }
    }

    if (file) {
      const fileInfo = await fromBuffer(file.buffer);

      if (!this.type.includes(fileInfo.mime)) {
        throw new UnsupportedMediaTypeException({
          errors: [
            {
              resource: 'File Upload',
              field: this.fieldName,
              message: `Requested ${this.type.map((t: string) => t).join(', ')}`,
            },
          ],
        } as FieldErrorsResponseDto);
      }
    }

    return file;
  }
}
