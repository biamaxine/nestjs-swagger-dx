import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { type Request } from 'express';
import { SDXRoute } from 'src/shared/decorators/route.decorator';

import { UserRegisterDto } from './dto/user-register.dto';
import { UserSignInDto } from './dto/user-sign-in.dto';
import { UserService } from './user.service';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserUpdateMeDto } from './dto/user-update-me.dto';
import { UserEnableDto } from './dto/user-enable.dto';
import { UserUpdateOneDto } from './dto/user-update-one.dto';
import UserSwagger from './user.swagger';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('auth/register')
  @SDXRoute(UserSwagger.REGISTER)
  REGISTER(@Body() dto: UserRegisterDto) {
    return this.service.register(dto);
  }

  @Post('auth/sign-in')
  @SDXRoute(UserSwagger.SIGN_IN)
  SIGN_IN(@Body() dto: UserSignInDto) {
    return this.service.signIn(dto);
  }

  @Get('users/me')
  @ApiBearerAuth()
  @SDXRoute(UserSwagger.READ_ME)
  READ_ME(@Req() req: Request) {
    return this.service.readMe(req);
  }

  @Get('users/:identifier')
  @ApiBearerAuth()
  @SDXRoute(UserSwagger.READ_ONE)
  READ_ONE(@Req() req: Request, @Param('identifier') identifier: string) {
    return this.service.readOne(req, identifier);
  }

  @Get('users')
  @ApiBearerAuth()
  @SDXRoute(UserSwagger.SEARCH)
  SEARCH(@Req() req: Request, @Query() query: UserFiltersDto) {
    return this.service.search(req, query);
  }

  @Patch('users/me')
  @ApiBearerAuth()
  @SDXRoute(UserSwagger.UPDATE_ME)
  UPDATE_ME(@Req() req: Request, @Body() dto: UserUpdateMeDto) {
    return this.service.updateMe(req, dto);
  }

  @Patch('users/:id')
  @ApiBearerAuth()
  @SDXRoute(UserSwagger.UPDATE_ONE)
  UPDATE_ONE(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UserUpdateOneDto,
  ) {
    return this.service.updateOne(req, id, dto);
  }

  @Patch('users/:id/disable')
  @ApiBearerAuth()
  @SDXRoute(UserSwagger.DISABLE)
  DISABLE(@Req() req: Request, @Param('id') id: string) {
    return this.service.disable(req, id);
  }

  @Patch('users/:id/enable')
  @SDXRoute(UserSwagger.ENABLE)
  @ApiBearerAuth()
  ENABLE(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UserEnableDto,
  ) {
    return this.service.enable(req, id, dto);
  }
}
