import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { UserRole } from './entities/user.model';
import { UserRegisterDto } from './dto/user-register.dto';

describe('UserService', () => {
  let service: UserService;

  // Usuário padrão para testes
  const mockUserDto: UserRegisterDto = {
    name: 'Teste Silva',
    cpf: '12345678901',
    email: 'teste@email.com',
    phone: '11999999999',
    password: 'Password123!',
  };

  // Função auxiliar para criar um mock do Request do Express com o token
  const mockReq = (token?: string): Request =>
    ({
      headers: { authorization: token ? `Bearer ${token}` : undefined },
    }) as Request;

  beforeEach(() => {
    // Instancia um novo serviço limpo antes de cada teste
    service = new UserService();
  });

  describe('Inicialização', () => {
    it('deve criar o usuário administrador padrão no construtor', () => {
      // Fazemos o login do admin para provar que ele existe
      const { token } = service.signIn({
        login: { email: 'admin@company.org' },
        password: 'Senha@123',
      });

      expect(token).toBeDefined();

      const admin = service.readMe(mockReq(token));
      expect(admin.email).toBe('admin@company.org');
      expect(admin.role).toBe(UserRole.administrator);
      expect(admin).not.toHaveProperty('password');
    });
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', () => {
      const user = service.register(mockUserDto);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBe(mockUserDto.name);
      expect(user.role).toBe(UserRole.user); // Default role
      expect(user).not.toHaveProperty('password'); // Garante que não retorna a senha
    });

    it('deve lançar ConflictException se o CPF já existir', () => {
      service.register(mockUserDto);
      expect(() =>
        service.register({ ...mockUserDto, email: 'outro@email.com' }),
      ).toThrow(ConflictException);
    });

    it('deve lançar ConflictException se o Email já existir', () => {
      service.register(mockUserDto);
      expect(() =>
        service.register({ ...mockUserDto, cpf: '00000000000' }),
      ).toThrow(ConflictException);
    });
  });

  describe('signIn', () => {
    beforeEach(() => {
      service.register(mockUserDto);
    });

    it('deve autenticar usando o e-mail', () => {
      const result = service.signIn({
        login: { email: mockUserDto.email },
        password: mockUserDto.password,
      });
      expect(result.token).toBeDefined();
    });

    it('deve autenticar usando o CPF', () => {
      const result = service.signIn({
        login: { cpf: mockUserDto.cpf },
        password: mockUserDto.password,
      });
      expect(result.token).toBeDefined();
    });

    it('deve lançar UnauthorizedException com senha incorreta', () => {
      expect(() =>
        service.signIn({
          login: { email: mockUserDto.email },
          password: 'wrong_password',
        }),
      ).toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException para usuário inexistente', () => {
      expect(() =>
        service.signIn({
          login: { email: 'naoexiste@email.com' },
          password: 'any',
        }),
      ).toThrow(UnauthorizedException);
    });

    it('deve lançar BadRequestException se o objeto de login estiver vazio', () => {
      expect(() =>
        service.signIn({
          login: {} as any,
          password: mockUserDto.password,
        }),
      ).toThrow(BadRequestException);
    });
  });

  describe('Operações Autenticadas (Me)', () => {
    let token: string;

    beforeEach(() => {
      service.register(mockUserDto);
      token = service.signIn({
        login: { email: mockUserDto.email },
        password: mockUserDto.password,
      }).token;
    });

    it('readMe: deve retornar os dados do próprio usuário', () => {
      const user = service.readMe(mockReq(token));
      expect(user.email).toBe(mockUserDto.email);
    });

    it('readMe: deve lançar UnauthorizedException sem token', () => {
      expect(() => service.readMe(mockReq())).toThrow(UnauthorizedException);
    });

    it('updateMe: deve atualizar os dados do usuário', () => {
      const updated = service.updateMe(mockReq(token), { name: 'Novo Nome' });
      expect(updated.name).toBe('Novo Nome');
      expect(updated.email).toBe(mockUserDto.email); // Mantém os outros dados
    });

    it('updateMe: deve lançar ConflictException ao tentar usar um e-mail já em uso', () => {
      // Tenta usar o e-mail do admin que já existe
      expect(() =>
        service.updateMe(mockReq(token), { email: 'admin@company.org' }),
      ).toThrow(ConflictException);
    });

    it('updateMe: deve lançar BadRequestException se o DTO estiver vazio', () => {
      expect(() => service.updateMe(mockReq(token), {})).toThrow(
        BadRequestException,
      );
    });
  });

  describe('Operações de Administrador (readOne, search, updateOne, disable, enable)', () => {
    let adminToken: string;
    let userToken: string;
    let registeredUserId: string;

    beforeEach(() => {
      // Login Admin
      adminToken = service.signIn({
        login: { email: 'admin@company.org' },
        password: 'Senha@123',
      }).token;

      // Registrar e Login User Normal
      const user = service.register(mockUserDto);
      registeredUserId = user.id;
      userToken = service.signIn({
        login: { email: mockUserDto.email },
        password: mockUserDto.password,
      }).token;
    });

    describe('readOne', () => {
      it('deve retornar um usuário por ID (Admin)', () => {
        const user = service.readOne(mockReq(adminToken), registeredUserId);
        expect(user.id).toBe(registeredUserId);
      });

      it('deve retornar um usuário por CPF (Admin)', () => {
        const user = service.readOne(mockReq(adminToken), mockUserDto.cpf);
        expect(user.cpf).toBe(mockUserDto.cpf);
      });

      it('deve lançar ForbiddenException se um usuário comum tentar buscar', () => {
        expect(() =>
          service.readOne(mockReq(userToken), 'admin@company.org'),
        ).toThrow(ForbiddenException);
      });
    });

    describe('search', () => {
      it('deve retornar usuários filtrados por nome', () => {
        const users = service.search(mockReq(adminToken), { name: 'Teste' });
        expect(users.length).toBe(1);
        expect(users[0].name).toContain('Teste');
      });

      it('deve retornar array vazio se não encontrar', () => {
        const users = service.search(mockReq(adminToken), { name: 'Fantasma' });
        expect(users.length).toBe(0);
      });
    });

    describe('updateOne', () => {
      it('deve atualizar outro usuário (Admin)', () => {
        const updated = service.updateOne(
          mockReq(adminToken),
          registeredUserId,
          { role: UserRole.moderator },
        );
        expect(updated.role).toBe(UserRole.moderator);
      });

      it('deve lançar NotFoundException para ID inexistente', () => {
        expect(() =>
          service.updateOne(mockReq(adminToken), 'fake-id', {
            email: 'teste@company.org',
          }),
        ).toThrow(NotFoundException);
      });
    });

    describe('disable / enable', () => {
      it('deve desativar um usuário e impedir o login', () => {
        // Desativa
        service.disable(mockReq(adminToken), registeredUserId);

        // Tenta buscar no search (deve ignorar inativos)
        const users = service.search(mockReq(adminToken), {
          cpf: mockUserDto.cpf,
        });
        expect(users.length).toBe(0);

        // Tenta fazer login com o usuário desativado
        expect(() =>
          service.signIn({
            login: { cpf: mockUserDto.cpf }, // Email foi nullificado, usa CPF
            password: mockUserDto.password,
          }),
        ).toThrow(UnauthorizedException);
      });

      it('deve reativar um usuário', () => {
        // Desativa
        service.disable(mockReq(adminToken), registeredUserId);

        // Reativa
        const newEmail = 'novo_email_ativo@email.com';
        const enabledUser = service.enable(
          mockReq(adminToken),
          registeredUserId,
          { email: newEmail },
        );

        expect(enabledUser.email).toBe(newEmail);

        // Login deve voltar a funcionar com o novo email
        const loginResult = service.signIn({
          login: { email: newEmail },
          password: mockUserDto.password,
        });
        expect(loginResult.token).toBeDefined();
      });

      it('deve lançar ForbiddenException se usuário comum tentar desativar alguém', () => {
        expect(() =>
          service.disable(mockReq(userToken), registeredUserId),
        ).toThrow(ForbiddenException);
      });
    });
  });
});
