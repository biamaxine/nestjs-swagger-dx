import { SDXProperty } from 'src/shared/decorators/property.decorator';

export class UserRegisterDto {
  @SDXProperty({
    maxLength: 100,
    transformers: ['ToNormalized', 'ToUppercase'],
    validators: 'IsNotEmpty',
  })
  name: string;

  @SDXProperty({
    minLength: 11,
    maxLength: 11,
    transformers: 'ToCleanOfSymbols',
  })
  cpf: string;

  @SDXProperty({ validators: 'IsEmail' })
  email: string;

  @SDXProperty({
    required: false,
    transformers: 'ToCleanOfSymbols',
    validators: 'IsPhoneNumber',
  })
  phone?: string;

  @SDXProperty({ validators: 'IsStrongPassword' })
  password: string;
}
