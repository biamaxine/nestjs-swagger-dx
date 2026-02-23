import { SDXParams } from 'src/shared/decorators/params.decorator';
import { SDXResponses } from 'src/shared/decorators/responses.decorator';
import { SDXRoute } from 'src/shared/decorators/route.decorator';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.model';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

const USER = new User({
  name: 'John Doe',
  cpf: '01234567890',
  email: 'john.doe@company.org',
  role: UserRole.user,
  password: 'Password@123',
});

const { password: _, ...rest } = USER;
const USER_DISPLAY = {
  ...rest,
  updated_at: USER.updated_at,
  deleted_at: USER.deleted_at,
};

const REGISTER: SDXRoute<{
  responses: SDXResponses<'CREATED' | 'CONFLICT'>;
}> = {
  summary: 'Registra um novo usuário',
  statusCode: HttpStatus.CREATED,
  responses: {
    CREATED: {
      description: 'Registro criado com sucesso',
      example: USER_DISPLAY,
    },
    CONFLICT: {
      description: 'E-mail ou CPF já cadastrados',
      example: new ConflictException(),
    },
  },
};

const SIGN_IN: SDXRoute<{
  responses: SDXResponses<'OK' | 'BAD_REQUEST' | 'UNAUTHORIZED'>;
}> = {
  summary: 'Autentica um usuário e retorna o token de acesso',
  statusCode: HttpStatus.OK,
  responses: {
    OK: {
      description: 'Login realizado com sucesso',
      example: { token: 'token-jwt-de-acesso' },
    },
    BAD_REQUEST: {
      description: 'Login inválido ou ausente',
      example: new BadRequestException('invalid login'),
    },
    UNAUTHORIZED: {
      description: 'Credenciais inválidas',
      example: new UnauthorizedException('invalid credentials'),
    },
  },
};

const READ_ME: SDXRoute<{
  responses: SDXResponses<'OK' | 'UNAUTHORIZED'>;
}> = {
  summary: 'Retorna os dados do usuário autenticado',
  statusCode: HttpStatus.OK,
  responses: {
    OK: {
      description: 'Dados do usuário',
      example: USER_DISPLAY,
    },
    UNAUTHORIZED: {
      description: 'Token inválido ou ausente',
      example: new UnauthorizedException('invalid authentication'),
    },
  },
};

const READ_ONE: SDXRoute<{
  params: SDXParams<'identifier'>;
  responses: SDXResponses<'OK' | 'NOT_FOUND' | 'FORBIDDEN' | 'UNAUTHORIZED'>;
}> = {
  summary:
    'Retorna um usuário específico pelo identificador (ID, CPF ou E-mail)',
  statusCode: HttpStatus.OK,
  params: {
    identifier: { description: 'O ID, CPF ou E-mail do usuário buscado' },
  },
  responses: {
    OK: {
      description: 'Dados do usuário',
      example: USER_DISPLAY,
    },
    NOT_FOUND: {
      description: 'Usuário não encontrado',
      example: new NotFoundException('user not found'),
    },
    FORBIDDEN: {
      description: 'Privilégios insuficientes',
      example: new ForbiddenException('insufficient privilegies'),
    },
    UNAUTHORIZED: {
      description: 'Token inválido ou ausente',
      example: new UnauthorizedException('invalid authentication'),
    },
  },
};

const SEARCH: SDXRoute<{
  responses: SDXResponses<'OK' | 'FORBIDDEN' | 'UNAUTHORIZED'>;
}> = {
  summary: 'Busca usuários baseada em filtros de query',
  statusCode: HttpStatus.OK,
  responses: {
    OK: {
      description: 'Lista de usuários filtrada',
      example: [USER_DISPLAY],
    },
    FORBIDDEN: {
      description: 'Privilégios insuficientes',
      example: new ForbiddenException('insufficient privilegies'),
    },
    UNAUTHORIZED: {
      description: 'Token inválido ou ausente',
      example: new UnauthorizedException('invalid authentication'),
    },
  },
};

const UPDATE_ME: SDXRoute<{
  responses: SDXResponses<'OK' | 'BAD_REQUEST' | 'CONFLICT' | 'UNAUTHORIZED'>;
}> = {
  summary: 'Atualiza os dados do próprio usuário autenticado',
  statusCode: HttpStatus.OK,
  responses: {
    OK: {
      description: 'Dados atualizados com sucesso',
      example: USER_DISPLAY,
    },
    BAD_REQUEST: {
      description: 'Nenhum dado fornecido para atualização',
      example: new BadRequestException('no provided data to update'),
    },
    CONFLICT: {
      description: 'E-mail ou CPF já em uso por outra conta',
      example: new ConflictException(),
    },
    UNAUTHORIZED: {
      description: 'Token inválido ou ausente',
      example: new UnauthorizedException('invalid authentication'),
    },
  },
};

const UPDATE_ONE: SDXRoute<{
  params: SDXParams<'id'>;
  responses: SDXResponses<
    | 'OK'
    | 'BAD_REQUEST'
    | 'NOT_FOUND'
    | 'CONFLICT'
    | 'FORBIDDEN'
    | 'UNAUTHORIZED'
  >;
}> = {
  summary: 'Atualiza os dados de um usuário específico pelo ID',
  statusCode: HttpStatus.OK,
  params: {
    id: { description: 'O ID (UUID) do usuário' },
  },
  responses: {
    OK: {
      description: 'Dados atualizados com sucesso',
      example: USER_DISPLAY,
    },
    BAD_REQUEST: {
      description: 'Nenhum dado fornecido para atualização',
      example: new BadRequestException(),
    },
    NOT_FOUND: {
      description: 'Usuário não encontrado',
      example: new NotFoundException('user not found'),
    },
    CONFLICT: {
      description: 'E-mail ou CPF já em uso por outra conta',
      example: new ConflictException(),
    },
    FORBIDDEN: {
      description: 'Privilégios insuficientes',
      example: new ForbiddenException('insufficient privilegies'),
    },
    UNAUTHORIZED: {
      description: 'Token inválido ou ausente',
      example: new UnauthorizedException('invalid authentication'),
    },
  },
};

const DISABLE: SDXRoute<{
  params: SDXParams<'id'>;
  responses: SDXResponses<'OK' | 'NOT_FOUND' | 'FORBIDDEN' | 'UNAUTHORIZED'>;
}> = {
  summary: 'Desativa a conta de um usuário (Soft Delete)',
  statusCode: HttpStatus.OK,
  params: {
    id: { description: 'O ID (UUID) do usuário' },
  },
  responses: {
    OK: {
      description: 'Usuário desativado com sucesso',
    },
    NOT_FOUND: {
      description: 'Usuário não encontrado',
      example: new NotFoundException('user not found'),
    },
    FORBIDDEN: {
      description: 'Privilégios insuficientes',
      example: new ForbiddenException('insufficient privilegies'),
    },
    UNAUTHORIZED: {
      description: 'Token inválido ou ausente',
      example: new UnauthorizedException('invalid authentication'),
    },
  },
};

const ENABLE: SDXRoute<{
  params: SDXParams<'id'>;
  responses: SDXResponses<
    'OK' | 'NOT_FOUND' | 'CONFLICT' | 'FORBIDDEN' | 'UNAUTHORIZED'
  >;
}> = {
  summary: 'Reativa a conta de um usuário',
  statusCode: HttpStatus.OK,
  params: {
    id: { description: 'O ID (UUID) do usuário' },
  },
  responses: {
    OK: {
      description: 'Usuário reativado com sucesso',
      example: USER_DISPLAY,
    },
    NOT_FOUND: {
      description: 'Usuário não encontrado',
      example: new NotFoundException('user not found'),
    },
    CONFLICT: {
      description: 'O E-mail fornecido já está em uso',
      example: new ConflictException(),
    },
    FORBIDDEN: {
      description: 'Privilégios insuficientes',
      example: new ForbiddenException('insufficient privilegies'),
    },
    UNAUTHORIZED: {
      description: 'Token inválido ou ausente',
      example: new UnauthorizedException('invalid authentication'),
    },
  },
};

export default {
  REGISTER,
  SIGN_IN,
  READ_ME,
  READ_ONE,
  SEARCH,
  UPDATE_ME,
  UPDATE_ONE,
  DISABLE,
  ENABLE,
};
