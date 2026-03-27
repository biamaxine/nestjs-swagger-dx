import { Test, TestingModule } from '@nestjs/testing';
import { TestController } from './test.controller';
import {
  InjectByInferedTypeDto,
  InjectBySwaggerPropsDto,
  InjectByTransformerDto,
  InjectByValidatorsDto,
} from './test.dto';

describe('TestController', () => {
  let controller: TestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    controller = module.get<TestController>(TestController);
  });

  describe('Instanciação', () => {
    it('O controller foi instanciado corretamente?', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('Endpoint: /test/infered-type (INFERED_TYPE)', () => {
    it('O método retorna exatamente o mesmo objeto recebido no parâmetro dto?', () => {
      const mockDto = { string: 'test', number: 1 } as InjectByInferedTypeDto;
      const result = controller.INFERED_TYPE(mockDto);

      expect(result).toBe(mockDto);
    });
  });

  describe('Endpoint: /test/swagger-props (SWAGGER_PROPS)', () => {
    it('O método repassa para o retorno o exato mesmo DTO de propriedades do Swagger recebido?', () => {
      const mockDto = { string_length: 'test' } as InjectBySwaggerPropsDto;
      const result = controller.SWAGGER_PROPS(mockDto);

      expect(result).toBe(mockDto);
    });
  });

  describe('Endpoint: /test/validators (VALIDATORS)', () => {
    it('O retorno do método corresponde à exata instância do DTO de validadores customizados injetada?', () => {
      const mockDto = { email: 'test@example.com' } as InjectByValidatorsDto;
      const result = controller.VALIDATORS(mockDto);

      expect(result).toBe(mockDto);
    });
  });

  describe('Endpoint: /test/transformer (TRANSFORMERS)', () => {
    it('A resposta da função preserva a referência do objeto DTO de transformadores enviado no corpo?', () => {
      const mockDto = { uppercase: 'TEXT' } as InjectByTransformerDto;
      const result = controller.TRANSFORMERS(mockDto);

      expect(result).toBe(mockDto);
    });
  });
});
