import { ValidationOptions } from 'class-validator';
import {
  SDXValidation,
  SDXValidationMap,
  SDXValidationWithInput,
} from './validation-map';

export type SDXValidationConfig = {
  [P in SDXValidation]?: SDXValidationMap[P] & {
    validationOptions?: ValidationOptions;
  };
} & Partial<
  Record<SDXValidationWithInput, { validationOptions?: ValidationOptions }>
>;
