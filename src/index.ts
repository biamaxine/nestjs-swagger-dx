export * from './shared/modules/validation.module';
export * from './shared/types/validation-config';

import {
  SDX_VALIDATOR,
  SDX_VALIDATOR_WITH_INPUT,
} from './shared/constants/validator';

export const SDXValidator = { ...SDX_VALIDATOR, ...SDX_VALIDATOR_WITH_INPUT };

export { SDX_TRANSFORMER as SDXTransformer } from './shared/constants/transformer';

export * from './shared/decorators/property.decorator';
export * from './shared/types/property-options';

export * from './shared/decorators/params.decorator';
export * from './shared/decorators/queries.decorator';
export * from './shared/decorators/responses.decorator';
export * from './shared/decorators/route.decorator';

export * from './shared/decorators/prisma/is-sort-order-input.validator';
export * from './shared/decorators/prisma/is-sort-order.validator';
export * from './shared/dto/prisma/pagination.dto';
export * from './shared/dto/prisma/sort-order-input.dto';

