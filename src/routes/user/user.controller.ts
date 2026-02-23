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

import { UserRegisterDto } from './dto/user-register.dto';
import { UserSignInDto } from './dto/user-sign-in.dto';
import { UserService } from './user.service';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserUpdateMeDto } from './dto/user-update-me.dto';
import { UserEnableDto } from './dto/user-enable.dto';
import { UserUpdateOneDto } from './dto/user-update-one.dto';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('auth/register')
  REGISTER(@Body() dto: UserRegisterDto) {
    return this.service.register(dto);
  }

  @Post('auth/sign-in')
  SIGN_IN(@Body() dto: UserSignInDto) {
    return this.service.signIn(dto);
  }

  @Get('users/me')
  @ApiBearerAuth()
  READ_ME(@Req() req: Request) {
    return this.service.readMe(req);
  }

  @Get('users/:identifier')
  @ApiBearerAuth()
  READ_ONE(@Req() req: Request, @Param('identifier') identifier: string) {
    return this.service.readOne(req, identifier);
  }

  @Get('users')
  @ApiBearerAuth()
  SEARCH(@Req() req: Request, @Query() query: UserFiltersDto) {
    return this.service.search(req, query);
  }

  @Patch('users/me')
  @ApiBearerAuth()
  UPDATE_ME(@Req() req: Request, @Body() dto: UserUpdateMeDto) {
    return this.service.updateMe(req, dto);
  }

  @Patch('users/:id')
  @ApiBearerAuth()
  UPDATE_ONE(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UserUpdateOneDto,
  ) {
    return this.service.updateOne(req, id, dto);
  }

  @Patch('users/:id/disable')
  @ApiBearerAuth()
  DISABLE(@Req() req: Request, @Param('id') id: string) {
    return this.service.disable(req, id);
  }

  @Patch('users/:id/enable')
  @ApiBearerAuth()
  ENABLE(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UserEnableDto,
  ) {
    return this.service.enable(req, id, dto);
  }
}
