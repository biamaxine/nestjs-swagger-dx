import { Expose } from 'class-transformer';
import { SDXProperty } from 'src/shared/decorators/property.decorator';

interface PrismaPagination {
  page?: number;
  limit?: number;
}

export class PrismaPaginationDto implements PrismaPagination {
  @SDXProperty({ type: 'integer', minimum: 1, required: false, default: 1 })
  page?: number;

  @SDXProperty({ type: 'integer', minimum: 1, required: false, default: 10 })
  limit?: number;

  @SDXProperty({ type: 'integer' })
  @Expose()
  get skip(): number {
    const { page = 1, limit = 10 } = this;
    return (page - 1) * limit;
  }

  @SDXProperty({ type: 'integer' })
  @Expose()
  get take(): number {
    return this.limit || 10;
  }
}
