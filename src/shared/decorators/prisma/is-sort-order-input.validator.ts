import { applyDecorators } from '@nestjs/common';
import { getSchemaPath } from '@nestjs/swagger';

import { plainToInstance, Type } from 'class-transformer';
import { ValidationOptions } from 'class-validator';

import { SortOrder } from '../../constants/prisma/enums';
import { SDX_TRANSFORMER } from '../../constants/transformer';
import { PrismaSortOrderInputDto } from '../../dto/prisma/sort-order-input.dto';
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
      validators: ['IsObject', 'ValidateNested'],
      validationOptions: opts,
    }),
    Type(() => PrismaSortOrderInputDto),
    SDX_TRANSFORMER.StringTo(value =>
      plainToInstance(PrismaSortOrderInputDto, { sort: value }),
    ),
  );
}
