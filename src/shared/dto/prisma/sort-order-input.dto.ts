import { SDXProperty } from '../../decorators/property.decorator';

interface SortOrderInput {
  sort: 'asc' | 'desc';
  nulls?: 'first' | 'last';
}

export class PrismaSortOrderInputDto implements SortOrderInput {
  @SDXProperty({ enum: ['asc', 'desc'] })
  sort: 'asc' | 'desc';

  @SDXProperty({ enum: ['first', 'last'], required: false })
  nulls?: 'first' | 'last';
}
