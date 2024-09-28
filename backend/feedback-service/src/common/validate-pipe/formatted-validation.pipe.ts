import { FieldErrorsResponseDto } from '@common/dto/response.dto';
import {
  ValidationPipe,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FormattedValidationPipe extends ValidationPipe {
  constructor(entity: string) {
    super({
      exceptionFactory: (errors) => {
        throw new BadRequestException({
          errors: errors.map((error) => {
            return {
              resource: entity,
              field: error.property,
              message: Object.values(error.constraints).join(', '),
            };
          }),
        } as FieldErrorsResponseDto);
      },
    });
  }
}
