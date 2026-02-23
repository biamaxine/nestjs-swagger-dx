import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { User } from './entities/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserSignInDto } from './dto/user-sign-in.dto';
import { isEmail, isUUID } from 'class-validator';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserUpdateMeDto } from './dto/user-update-me.dto';
import { UserUpdateOneDto } from './dto/user-update-one.dto';
import { UserEnableDto } from './dto/user-enable.dto';
import { UserRole } from './entities/user.model';

@Injectable()
export class UserService {
  private readonly user_map = new Map<string, User>();
  private readonly cpf_map = new Map<string, string>();
  private readonly email_map = new Map<string, string>();

  private readonly token_map = new Map<string, string>();

  constructor() {
    const { id } = this.register({
      name: 'admin',
      email: 'admin@company.org',
      cpf: '00000000000',
      phone: '(92) 9 8765-4321',
      password: 'Senha@123',
    });

    this.user_map.get(id)?.update({ role: UserRole.administrator });
  }

  register(dto: UserRegisterDto) {
    const user = new User(dto);

    if (this.cpf_map.has(dto.cpf) || this.email_map.has(dto.email)) {
      throw new ConflictException();
    }

    this.user_map.set(user.id, user);
    this.cpf_map.set(dto.cpf, user.id);
    this.email_map.set(dto.email, user.id);

    return this.processUser(user);
  }

  signIn(dto: UserSignInDto) {
    const { login, password } = dto;

    if (login.cpf || login.email) {
      const user = login.cpf
        ? this.getUserByCpf(login.cpf)
        : this.getUserByEmail(login.email);

      if (!user || !user.is_active || password !== user.password)
        throw new UnauthorizedException('invalid credentials');

      const token = crypto.randomUUID();
      this.token_map.set(token, user.id);

      return { token };
    }

    throw new BadRequestException('invalid login');
  }

  readMe(req: Request) {
    const user = this.checkAuthentication(req);
    return this.processUser(user);
  }

  readOne(req: Request, identifier: string) {
    this.checkPrivilegies(req);

    const user = isUUID(identifier)
      ? this.user_map.get(identifier)
      : isEmail(identifier)
        ? this.getUserByEmail(identifier)
        : this.getUserByCpf(identifier);

    if (!user) throw new NotFoundException('user not found');

    return this.processUser(user);
  }

  search(req: Request, filters: UserFiltersDto) {
    this.checkPrivilegies(req);

    const { name, cpf, email, phone } = filters;

    const users = [...this.user_map.values()]
      .filter(user => user.is_active)
      .filter(user => {
        if (name && !user.name.includes(name)) return false;
        if (cpf && !user.cpf.includes(cpf)) return false;
        if (email && (!user.email || !user.email.includes(email))) return false;
        if (phone && (!user.phone || !user.phone.includes(phone))) return false;
        return true;
      });

    return users.map(user => this.processUser(user));
  }

  updateMe(req: Request, dto: UserUpdateMeDto) {
    const user = this.checkAuthentication(req);

    if (Object.keys(dto).length === 0)
      throw new BadRequestException('no provided data to update');

    if (dto.email && user.email && dto.email !== user.email) {
      if (this.email_map.has(dto.email)) throw new ConflictException();

      this.email_map.delete(user.email);
      this.email_map.set(dto.email, user.id);
    }

    user.update(dto);

    return this.processUser(user);
  }

  updateOne(req: Request, id: string, dto: UserUpdateOneDto) {
    this.checkPrivilegies(req);

    const user = this.user_map.get(id);

    if (Object.keys(dto).length === 0) throw new BadRequestException();

    if (!user) throw new NotFoundException('user not found');

    const { cpf, email } = dto;

    if ((cpf && cpf !== user.cpf) || (email && email !== user.email)) {
      if (cpf && this.cpf_map.has(cpf)) throw new ConflictException();
      if (email && this.email_map.has(email)) throw new ConflictException();

      if (cpf) {
        this.cpf_map.delete(user.cpf);
        this.cpf_map.set(cpf, user.id);
      }

      if (email) {
        this.email_map.delete(user.email!);
        this.email_map.set(email, user.id);
      }
    }

    user.update(dto);

    return this.processUser(user);
  }

  disable(req: Request, id: string): void {
    this.checkPrivilegies(req, true);

    const user = this.user_map.get(id);

    if (!user) throw new NotFoundException('user not found');

    this.email_map.delete(user.email!);
    user.disable();
  }

  enable(req: Request, id: string, dto: UserEnableDto) {
    this.checkPrivilegies(req, true);

    if (!this.user_map.has(id)) throw new NotFoundException('user not found');

    if (this.email_map.has(dto.email)) throw new ConflictException();

    const user = this.user_map.get(id)!;

    this.email_map.set(dto.email, user.id);
    user.enable(dto.email);

    return this.processUser(user);
  }

  private processUser(user: User) {
    const { password, ...rest } = user;
    return {
      ...rest,
      updated_at: user.updated_at,
      deleted_at: user.deleted_at,
    };
  }

  private checkPrivilegies(req: Request, needsAdmin?: boolean): void {
    const admin = this.checkAuthentication(req);

    if (needsAdmin && admin.role !== UserRole.administrator)
      throw new ForbiddenException('insufficient privilegies');

    if (admin.role === 'user')
      throw new ForbiddenException('insufficient privilegies');
  }

  private checkAuthentication({ headers: { authorization } }: Request): User {
    if (authorization) {
      const [, token] = authorization.split(' ');

      if (this.token_map.has(token)) {
        const id = this.token_map.get(token)!;
        const user = this.user_map.get(id);
        if (!user || !user.is_active) this.token_map.delete(token);
        else return user;
      }
    }

    throw new UnauthorizedException('invalid authentication');
  }

  private getUserByCpf(cpf?: string): User | undefined {
    if (!cpf || !this.cpf_map.has(cpf)) return undefined;
    const id = this.cpf_map.get(cpf)!;
    return this.user_map.get(id);
  }

  private getUserByEmail(email?: string): User | undefined {
    if (!email || !this.email_map.has(email)) return undefined;
    const id = this.email_map.get(email)!;
    return this.user_map.get(id);
  }
}
