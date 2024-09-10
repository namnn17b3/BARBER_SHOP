import { FieldErrorsResponseDto } from '@common/dto/response.dto';
import { Injectable, BadRequestException, ParseIntPipe } from '@nestjs/common';

@Injectable()
export class FormattedParseIntPipe extends ParseIntPipe {
  constructor(resource: string, field: string) {
    super({
      exceptionFactory: () => {
        throw new BadRequestException({
          errors: [
            {
              resource,
              field,
              message: 'Must be an integer',
            },
          ],
        } as FieldErrorsResponseDto);
      },
    });
  }
}
