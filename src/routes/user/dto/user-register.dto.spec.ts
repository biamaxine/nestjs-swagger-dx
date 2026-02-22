import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { SDXValidationModule } from 'src/shared/modules/validation.module';

// IMPORTANTE: As configurações globais precisam ser importadas antes do DTO.
//
// Isso por que os decorators são inicializados no DTO, e se forem carregados
// antes, eles não irão reconhecer as configurações globais definidas
SDXValidationModule.setup({ IsPhoneNumber: { region: 'BR' } });

import { UserRegisterDto } from './user-register.dto';

describe('UserRegisterDto', () => {
  // Função auxiliar para simular o comportamento do ValidationPipe
  const transformAndValidate = (payload: any) => {
    const dtoInstance = plainToInstance(UserRegisterDto, payload);
    const errors = validateSync(dtoInstance);
    return { dtoInstance, errors };
  };

  // Payload base válido
  const validPayload = {
    name: 'João da Silva',
    cpf: '123.456.789-00',
    email: 'joao@email.com',
    phone: '(11) 98765-4321',
    password: 'StrongPassword@123',
  };

  describe('Caminho Feliz e Transformações', () => {
    it('deve passar na validação com dados válidos e aplicar transformadores', () => {
      const payload = {
        ...validPayload,
        name: '   joão   da silva   ', // Espaços extras e minúsculas
        cpf: '123.456.789-00', // Com máscara
        phone: '(11) 98765-4321', // Com máscara
      };

      const { dtoInstance, errors } = transformAndValidate(payload);

      // Verificando transformações do ToNormalized e ToUppercase
      expect(dtoInstance.name).toBe('JOÃO DA SILVA');

      // Verificando transformações do ToCleanOfSymbols
      expect(dtoInstance.cpf).toBe('12345678900');
      expect(dtoInstance.phone).toBe('11987654321');

      expect(errors.length).toBe(0);
    });

    it('deve passar na validação se o telefone não for enviado (opcional)', () => {
      const { phone, ...payload } = validPayload;
      const { errors } = transformAndValidate(payload);
      expect(errors.length).toBe(0);
    });
  });

  describe('Validações de Campo (Erros Esperados)', () => {
    it('NAME: deve falhar se estiver vazio', () => {
      const { errors } = transformAndValidate({ ...validPayload, name: '   ' });
      // Após o ToNormalized, vira string vazia, caindo no IsNotEmpty
      const nameError = errors.find(e => e.property === 'name');
      expect(nameError).toBeDefined();
      expect(nameError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('NAME: deve falhar se exceder 100 caracteres', () => {
      const { errors } = transformAndValidate({
        ...validPayload,
        name: 'A'.repeat(101),
      });
      const nameError = errors.find(e => e.property === 'name');
      expect(nameError).toBeDefined();
      expect(nameError?.constraints).toHaveProperty('maxLength');
    });

    it('CPF: deve falhar se não tiver exatamente 11 dígitos', () => {
      // Menos de 11 dígitos após a limpeza
      const { errors: errMin } = transformAndValidate({
        ...validPayload,
        cpf: '123.456.789',
      });
      expect(
        errMin.find(e => e.property === 'cpf')?.constraints,
      ).toHaveProperty('minLength');

      // Mais de 11 dígitos após a limpeza
      const { errors: errMax } = transformAndValidate({
        ...validPayload,
        cpf: '123.456.789-001',
      });
      expect(
        errMax.find(e => e.property === 'cpf')?.constraints,
      ).toHaveProperty('maxLength');
    });

    it('EMAIL: deve falhar com formato inválido', () => {
      const { errors } = transformAndValidate({
        ...validPayload,
        email: 'email_invalido.com',
      });
      const emailError = errors.find(e => e.property === 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints).toHaveProperty('isEmail');
    });

    it('PHONE: deve falhar se for um telefone inválido', () => {
      const { errors } = transformAndValidate({
        ...validPayload,
        phone: '123', // Número curto demais
      });
      const phoneError = errors.find(e => e.property === 'phone');
      expect(phoneError).toBeDefined();
      expect(phoneError?.constraints).toHaveProperty('isPhoneNumber');
    });

    it('PASSWORD: deve falhar se a senha for fraca', () => {
      const { errors } = transformAndValidate({
        ...validPayload,
        password: 'senha', // Sem maiúscula, número e símbolo
      });
      const passwordError = errors.find(e => e.property === 'password');
      expect(passwordError).toBeDefined();
      expect(passwordError?.constraints).toHaveProperty('isStrongPassword');
    });
  });
});
