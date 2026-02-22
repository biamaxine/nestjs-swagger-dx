import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { SDXValidationModule } from 'src/shared/modules/validation.module';

// IMPORTANTE: As configurações globais precisam ser importadas antes do DTO.
SDXValidationModule.setup({});

import { UserFiltersDto } from './user-filters.dto';

describe('UserFiltersDto', () => {
  // Função auxiliar para simular o comportamento do ValidationPipe
  const transformAndValidate = (payload: any) => {
    const dtoInstance = plainToInstance(UserFiltersDto, payload);
    const errors = validateSync(dtoInstance);
    return { dtoInstance, errors };
  };

  describe('Caminho Feliz e Transformações', () => {
    it('deve passar na validação com payload vazio (todos os campos são opcionais)', () => {
      const { errors } = transformAndValidate({});
      expect(errors.length).toBe(0);
    });

    it('deve passar na validação e aplicar os transformadores corretamente', () => {
      const payload = {
        name: '   maria   silva   ', // Espaços extras e letras minúsculas
        cpf: '123.456.78', // Busca parcial de CPF (com máscara)
        email: 'maria@', // Busca parcial de e-mail
        phone: '(11) 9876', // Busca parcial de telefone (com máscara)
      };

      const { dtoInstance, errors } = transformAndValidate(payload);

      // Verificando transformações
      expect(dtoInstance.name).toBe('MARIA SILVA'); // ToNormalized + ToUppercase
      expect(dtoInstance.cpf).toBe('12345678'); // ToCleanOfSymbols
      expect(dtoInstance.phone).toBe('119876'); // ToCleanOfSymbols
      expect(dtoInstance.email).toBe('maria@'); // Sem transformação

      expect(errors.length).toBe(0);
    });
  });

  describe('Validações de Campo (Erros Esperados)', () => {
    it('NAME: deve falhar se exceder 100 caracteres', () => {
      const { errors } = transformAndValidate({
        name: 'A'.repeat(101),
      });
      const error = errors.find(e => e.property === 'name');
      expect(error).toBeDefined();
      expect(error?.constraints).toHaveProperty('maxLength');
    });

    it('CPF: deve falhar se exceder 11 dígitos após a limpeza', () => {
      const { errors } = transformAndValidate({
        cpf: '123.456.789-001', // 12 dígitos se removermos a pontuação
      });
      const error = errors.find(e => e.property === 'cpf');
      expect(error).toBeDefined();
      expect(error?.constraints).toHaveProperty('maxLength');
    });

    it('EMAIL: deve falhar se exceder 255 caracteres', () => {
      const { errors } = transformAndValidate({
        email: 'a'.repeat(246) + '@email.com', // 256 caracteres
      });
      const error = errors.find(e => e.property === 'email');
      expect(error).toBeDefined();
      expect(error?.constraints).toHaveProperty('maxLength');
    });

    it('PHONE: deve falhar se exceder 11 dígitos após a limpeza', () => {
      const { errors } = transformAndValidate({
        phone: '(11) 98765-43210', // 12 dígitos
      });
      const error = errors.find(e => e.property === 'phone');
      expect(error).toBeDefined();
      expect(error?.constraints).toHaveProperty('maxLength');
    });
  });
});
