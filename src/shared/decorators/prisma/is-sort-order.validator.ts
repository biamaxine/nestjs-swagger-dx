import { ValidationOptions } from 'class-validator';

import { SortOrder } from '../../constants/prisma/enums';
import { SDXProperty } from '../property.decorator';

export function IsPrismaSortOrder(opts?: ValidationOptions) {
  return SDXProperty({
    enum: SortOrder,
    required: false,
    validationOptions: opts,
  });
}
