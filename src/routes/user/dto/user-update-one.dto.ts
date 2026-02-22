import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { SDXProperty } from 'src/shared/decorators/property.decorator';

import { UserRegisterDto } from './user-register.dto';
import { UserUpdateMeDto } from './user-update-me.dto';
import { UserRole } from '../entities/user.model';

export class UserUpdateOneDto extends IntersectionType(
  PartialType(PickType(UserRegisterDto, ['cpf'])),
  PickType(UserUpdateMeDto, ['phone', 'email']),
) {
  @SDXProperty({ enum: UserRole, required: false })
  role?: UserRole;
}
