import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { SDXValidationModule } from 'src/shared/modules/validation.module';

// IMPORTANTE: As configurações globais precisam ser importadas antes do DTO.
SDXValidationModule.setup({ IsPhoneNumber: { region: 'BR' } });

import { UserUpdateMeDto } from './user-update-me.dto';

describe('UserUpdateMeDto', () => {
  // Função auxiliar para simular o comportamento do ValidationPipe
  const transformAndValidate = (payload: any) => {
    const dtoInstance = plainToInstance(UserUpdateMeDto, payload);
    const errors = validateSync(dtoInstance);
    return { dtoInstance, errors };
  };

  describe('Caminho Feliz e Transformações', () => {
    it('deve passar na validação com um payload vazio (todas as propriedades são opcionais)', () => {
      const { errors } = transformAndValidate({});
      expect(errors.length).toBe(0);
    });

    it('deve validar e aplicar transformadores das propriedades herdadas', () => {
      const payload = {
        name: '   joão   da silva   ', // Espaços extras e minúsculas
        email: 'joao@email.com',
      };

      const { dtoInstance, errors } = transformAndValidate(payload);

      expect(errors.length).toBe(0);
      // Garante que o ToNormalized e ToUppercase vieram de herança do UserRegisterDto
      expect(dtoInstance.name).toBe('JOÃO DA SILVA');
      expect(dtoInstance.email).toBe('joao@email.com');
    });

    it('deve aceitar o telefone formatado, aplicar limpeza de símbolos e validar', () => {
      const payload = {
        phone: '(11) 98765-4321', // Com máscara
      };

      const { dtoInstance, errors } = transformAndValidate(payload);

      expect(errors.length).toBe(0);
      // Garante que o ToCleanOfSymbols funcionou na propriedade reescrita
      expect(dtoInstance.phone).toBe('11987654321');
    });

    it('deve passar na validação se o telefone for explicitamente null (nullable: true)', () => {
      const payload = {
        phone: null,
      };

      const { dtoInstance, errors } = transformAndValidate(payload);

      expect(errors.length).toBe(0);
      expect(dtoInstance.phone).toBeNull();
    });
  });

  describe('Validações de Campo (Erros Esperados)', () => {
    it('NAME: deve falhar se for enviado, mas estiver em branco', () => {
      const { errors } = transformAndValidate({ name: '   ' });
      const nameError = errors.find(e => e.property === 'name');

      expect(nameError).toBeDefined();
      expect(nameError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('EMAIL: deve falhar se for enviado com formato inválido', () => {
      const { errors } = transformAndValidate({ email: 'email_invalido.com' });
      const emailError = errors.find(e => e.property === 'email');

      expect(emailError).toBeDefined();
      expect(emailError?.constraints).toHaveProperty('isEmail');
    });

    it('PHONE: deve falhar se enviado, mas não for um número de telefone válido do BR', () => {
      const { errors } = transformAndValidate({ phone: '123' });
      const phoneError = errors.find(e => e.property === 'phone');

      expect(phoneError).toBeDefined();
      expect(phoneError?.constraints).toHaveProperty('isPhoneNumber');
    });

    it('PASSWORD: deve falhar se a senha enviada for fraca', () => {
      const { errors } = transformAndValidate({ password: 'senha' });
      const passwordError = errors.find(e => e.property === 'password');

      expect(passwordError).toBeDefined();
      expect(passwordError?.constraints).toHaveProperty('isStrongPassword');
    });
  });
});
