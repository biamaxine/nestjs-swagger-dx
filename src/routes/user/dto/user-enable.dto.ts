import { PickType } from '@nestjs/swagger';

import { UserRegisterDto } from './user-register.dto';

export class UserEnableDto extends PickType(UserRegisterDto, ['email']) {}
