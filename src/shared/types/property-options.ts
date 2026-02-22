import { ApiPropertyOptions } from '@nestjs/swagger';
import { TransformOptions } from 'class-transformer';
import { ValidationOptions } from 'class-validator';

import { SDXValidation } from './validation-map';
import { PropertyDecoratorFn } from '../constants/class-validator-map';
import { SDXTransformer } from '../constants/transformer';

type SDXTransformers = keyof typeof SDXTransformer;

export type SDXPropertyOptions = ApiPropertyOptions & {
  transformers?:
    | SDXTransformers
    | PropertyDecoratorFn
    | (SDXTransformers | PropertyDecoratorFn)[];
  transformOptions?: TransformOptions;
  validators?:
    | SDXValidation
    | PropertyDecoratorFn
    | (SDXValidation | PropertyDecoratorFn)[];
  validationOptions?: ValidationOptions;

  docType?: ApiPropertyOptions['type'];
  ignoreTypeValidations?: boolean;
};
