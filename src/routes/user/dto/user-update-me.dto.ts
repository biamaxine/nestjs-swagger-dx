import { OmitType, PartialType } from '@nestjs/swagger';
import { SDXProperty } from 'src/shared/decorators/property.decorator';

import { UserRegisterDto } from './user-register.dto';

export class UserUpdateMeDto extends PartialType(
  OmitType(UserRegisterDto, ['cpf', 'phone']),
) {
  @SDXProperty({
    type: String,
    required: false,
    nullable: true,
    validators: 'IsPhoneNumber',
    transformers: 'ToCleanOfSymbols',
  })
  phone?: string | null;
}
