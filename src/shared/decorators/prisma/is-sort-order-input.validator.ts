import { applyDecorators } from '@nestjs/common';
import { getSchemaPath } from '@nestjs/swagger';

import { ValidationOptions } from 'class-validator';
import { SDXTransformer } from 'src';
import { PrismaSortOrderInputDto } from 'src/shared/dto/prisma/sort-order-input.dto';
import { SortOrder } from 'src/shared/constants/prisma/enums';

import { SDXProperty } from '../property.decorator';

export function IsPrismaSortOrderInput(opts?: ValidationOptions) {
  return applyDecorators(
    SDXProperty({
      ignoreTypeValidations: true,
      oneOf: [
        { type: getSchemaPath(PrismaSortOrderInputDto) },
        { type: 'string', enum: Object.keys(SortOrder) },
      ],
      required: false,
      validationOptions: opts,
    }),
    SDXTransformer.StringTo(value => ({ sort: value })),
  );
}
