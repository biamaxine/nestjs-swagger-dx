import { ApiPropertyOptions } from '@nestjs/swagger';
import { TransformOptions } from 'class-transformer';
import { ValidationOptions } from 'class-validator';

import { PropertyDecoratorFn } from '../constants/class-validator-map';
import { SDX_TRANSFORMER } from '../constants/transformer';
import { SDXValidation } from './validation-map';

type SDX_TRANSFORMERs = keyof typeof SDX_TRANSFORMER;

export type SDXPropertyOptions = ApiPropertyOptions & {
  transformers?:
    | SDX_TRANSFORMERs
    | PropertyDecoratorFn
    | (SDX_TRANSFORMERs | PropertyDecoratorFn)[];
  transformOptions?: TransformOptions;
  validators?:
    | SDXValidation
    | PropertyDecoratorFn
    | (SDXValidation | PropertyDecoratorFn)[];
  validationOptions?: ValidationOptions;

  docType?: ApiPropertyOptions['type'];
  docRequired?: boolean;
  docNullable?: boolean;

  ignoreValidations?: boolean;
};
