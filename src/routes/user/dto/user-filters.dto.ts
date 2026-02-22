import { SDXProperty } from 'src/shared/decorators/property.decorator';

export class UserFiltersDto {
  @SDXProperty({
    required: false,
    maxLength: 100,
    transformers: ['ToNormalized', 'ToUppercase'],
  })
  name?: string;

  @SDXProperty({
    required: false,
    maxLength: 11,
    transformers: 'ToCleanOfSymbols',
  })
  cpf?: string;

  @SDXProperty({ required: false, maxLength: 255 })
  email?: string;

  @SDXProperty({
    required: false,
    maxLength: 11,
    transformers: 'ToCleanOfSymbols',
  })
  phone?: string;
}
