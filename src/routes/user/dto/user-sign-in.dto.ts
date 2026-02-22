import { PickType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { SDXProperty } from 'src/shared/decorators/property.decorator';
import { SDX_TRANSFORMER as SDXTransformer } from 'src/shared/constants/transformer';

import { UserRegisterDto } from './user-register.dto';
import { plainToInstance } from 'class-transformer';

class UserLoginDto extends PartialType(
  PickType(UserRegisterDto, ['cpf', 'email']),
) {}

export class UserSignInDto {
  @SDXProperty({ docType: String })
  @SDXTransformer.StringTo<UserLoginDto, string>((v: string) =>
    plainToInstance(UserLoginDto, v.includes('@') ? { email: v } : { cpf: v }),
  )
  login: UserLoginDto;

  @SDXProperty({ validators: 'IsNotEmpty' })
  password: string;
}
