import { FieldErrorsResponseDto } from '@common/dto/response.dto';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { fromBuffer } from 'file-type';

@Injectable()
export class FileFiledsValidationPipe implements PipeTransform {
  constructor(
    private readonly fieldNames: string[],
    private readonly type: string[],
    private readonly sizeOfFiles: number,
    private readonly numberOfFileField: number,
    private readonly requestMethod: string,
    private readonly maxFileSizeMb?: number,
  ) {}

  async transform(files: any): Promise<Array<Express.Multer.File>> {
    const fileFields = Object.keys(files);
    if (!fileFields?.length && this.requestMethod === 'POST') {
      throw new BadRequestException({
        errors: [
          {
            resource: 'Files Upload',
            field: this.fieldNames.join(', '),
            message: `Requested ${this.type.map((t: string) => t).join(', ')} or uploaded files is not empty`,
          },
        ],
      } as FieldErrorsResponseDto);
    }

    if (fileFields?.length) {
      if (fileFields.length > this.sizeOfFiles || fileFields.length < 1) {
        throw new BadRequestException({
          errors: [
            {
              resource: 'Files Upload',
              field: this.fieldNames.join(', '),
              message: `Requested size of files must be less than ${this.sizeOfFiles} and greater than 1`,
            },
          ],
        } as FieldErrorsResponseDto);
      }

      const fileErrors = [];
      for (const fileField of fileFields) {
        const fileArrayInFileField = files[fileField];
        if (fileArrayInFileField.length !== 1) {
          fileErrors.push({
            resource: 'File Upload',
            field: `File ${fileField}`,
            message: `File ${fileField} size must be equal ${this.numberOfFileField}`,
          });
        }
        const file = fileArrayInFileField[0];
        if (this.maxFileSizeMb) {
          const maxFileSizeByte = this.maxFileSizeMb * 1024 * 1024;
          const maxFileSizeKb = this.maxFileSizeMb * 1024;

          if (file.size > maxFileSizeByte) {
            fileErrors.push({
              resource: 'File Upload',
              field: `File ${fileField}`,
              message: `File ${fileField} size must be less than ${maxFileSizeKb}kb`,
            });
          }
        }

        const fileInfo = await fromBuffer(file.buffer);
        if (!this.type.includes(fileInfo.mime)) {
          fileErrors.push({
            resource: 'File Upload',
            field: `File ${fileField}`,
            message: `File ${fileField} requested ${this.type.map((t: string) => t).join(', ')}`,
          });
        }
      }

      if (fileErrors.length) {
        throw new BadRequestException({
          errors: fileErrors,
        } as FieldErrorsResponseDto);
      }
    }

    const fileTransformeds = [];
    for (const fileField of fileFields) {
      const fileArrayInFileField = files[fileField];
      const file = fileArrayInFileField[0];
      fileTransformeds.push(file);
    }

    return fileTransformeds;
  }
}
