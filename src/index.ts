export * from './shared/types/validation-config';
export * from './shared/modules/validation.module';

import {
  SDX_VALIDATOR,
  SDX_VALIDATOR_WITH_INPUT,
} from './shared/constants/validator';

export const SDXValidator = { ...SDX_VALIDATOR, ...SDX_VALIDATOR_WITH_INPUT };

export { SDX_TRANSFORMER as SDXTransformer } from './shared/constants/transformer';

export * from './shared/types/property-options';
export * from './shared/decorators/property.decorator';
