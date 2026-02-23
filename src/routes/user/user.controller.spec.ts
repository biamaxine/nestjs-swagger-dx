import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserSignInDto } from './dto/user-sign-in.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserUpdateMeDto } from './dto/user-update-me.dto';
import { UserUpdateOneDto } from './dto/user-update-one.dto';
import { UserEnableDto } from './dto/user-enable.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  // Mock do Request do Express
  const mockReq = {} as Request;

  // Mock do UserService mantendo as assinaturas dos métodos
  const mockUserService = {
    register: jest.fn(),
    signIn: jest.fn(),
    readMe: jest.fn(),
    readOne: jest.fn(),
    search: jest.fn(),
    updateMe: jest.fn(),
    updateOne: jest.fn(),
    disable: jest.fn(),
    enable: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('Rotas de Autenticação', () => {
    it('REGISTER: deve chamar service.register com o DTO fornecido', () => {
      const dto = new UserRegisterDto();
      const expectedResult = { id: '123' };
      mockUserService.register.mockReturnValue(expectedResult);

      const result = controller.REGISTER(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toBe(expectedResult);
    });

    it('SIGN_IN: deve chamar service.signIn com o DTO fornecido', () => {
      const dto = new UserSignInDto();
      const expectedResult = { token: 'jwt-token' };
      mockUserService.signIn.mockReturnValue(expectedResult);

      const result = controller.SIGN_IN(dto);

      expect(service.signIn).toHaveBeenCalledWith(dto);
      expect(result).toBe(expectedResult);
    });
  });

  describe('Rotas de Leitura', () => {
    it('READ_ME: deve chamar service.readMe com o Request', () => {
      controller.READ_ME(mockReq);
      expect(service.readMe).toHaveBeenCalledWith(mockReq);
    });

    it('READ_ONE: deve chamar service.readOne com Request e identifier', () => {
      const identifier = '12345678900';
      controller.READ_ONE(mockReq, identifier);
      expect(service.readOne).toHaveBeenCalledWith(mockReq, identifier);
    });

    it('SEARCH: deve chamar service.search com Request e query filters', () => {
      const filters = new UserFiltersDto();
      controller.SEARCH(mockReq, filters);
      expect(service.search).toHaveBeenCalledWith(mockReq, filters);
    });
  });

  describe('Rotas de Atualização', () => {
    it('UPDATE_ME: deve chamar service.updateMe com Request e DTO', () => {
      const dto = new UserUpdateMeDto();
      controller.UPDATE_ME(mockReq, dto);
      expect(service.updateMe).toHaveBeenCalledWith(mockReq, dto);
    });

    it('UPDATE_ONE: deve chamar service.updateOne com Request, id e DTO', () => {
      const id = 'uuid-123';
      const dto = new UserUpdateOneDto();
      controller.UPDATE_ONE(mockReq, id, dto);
      expect(service.updateOne).toHaveBeenCalledWith(mockReq, id, dto);
    });
  });

  describe('Rotas de Deleção/Ativação', () => {
    it('DISABLE: deve chamar service.disable com Request e id', () => {
      const id = 'uuid-123';
      controller.DISABLE(mockReq, id);
      expect(service.disable).toHaveBeenCalledWith(mockReq, id);
    });

    it('ENABLE: deve chamar service.enable com Request, id e DTO', () => {
      const id = 'uuid-123';
      const dto = new UserEnableDto();
      controller.ENABLE(mockReq, id, dto);
      expect(service.enable).toHaveBeenCalledWith(mockReq, id, dto);
    });
  });
});
