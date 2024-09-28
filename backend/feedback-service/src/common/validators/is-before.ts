import { Operators } from '@common/enum/operators.enum';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const IS_BEFORE = 'isBefore';

@ValidatorConstraint({ name: IS_BEFORE })
@Injectable()
export class IsBeforeValidator implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    const comparisonValue = args.object[args.constraints[0]];
    const comparisonType = args.constraints[1];

    if (!comparisonValue) return true;

    if (comparisonType === Operators.Lteq) {
      return propertyValue <= comparisonValue;
    } else {
      return propertyValue < comparisonValue;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const dtoName = args.object.constructor.name;
    return `${args.property} must be ${args.constraints[1]} ${args.constraints[0]}`;
  }
}

export function IsBefore(
  constraint: string,
  comparisonType: Operators.Lt | Operators.Lteq = Operators.Lt,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [constraint, comparisonType],
      validator: IsBeforeValidator,
    });
  };
}
