import { NullsOrder, SortOrder } from '../../constants/prisma/enums';
import { SDXProperty } from '../../decorators/property.decorator';

interface SortOrderInput {
  sort: SortOrder;
  nulls?: NullsOrder;
}

export class PrismaSortOrderInputDto implements SortOrderInput {
  @SDXProperty({ enum: SortOrder })
  sort: SortOrder;

  @SDXProperty({ enum: NullsOrder, required: false })
  nulls?: NullsOrder;
}
