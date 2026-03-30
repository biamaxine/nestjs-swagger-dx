import { ValidationOptions } from 'class-validator';

import { SDXProperty } from '../property.decorator';

export function IsPrismaSortOrder(opts?: ValidationOptions) {
  return SDXProperty({
    enum: ['asc', 'desc'],
    required: false,
    validationOptions: opts,
  });
}
