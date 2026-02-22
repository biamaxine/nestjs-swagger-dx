import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { UserEnableDto } from './user-enable.dto';

describe('UserEnableDto', () => {
  // Função auxiliar para simular o comportamento do ValidationPipe
  const transformAndValidate = (payload: any) => {
    const dtoInstance = plainToInstance(UserEnableDto, payload);
    const errors = validateSync(dtoInstance);
    return { dtoInstance, errors };
  };

  describe('Caminho Feliz', () => {
    it('deve passar na validação com um e-mail válido', () => {
      const payload = {
        email: 'usuario_valido@company.org',
      };

      const { errors } = transformAndValidate(payload);

      // Nenhuma violação de regra deve ser encontrada
      expect(errors.length).toBe(0);
    });
  });

  describe('Validações de Campo (Erros Esperados)', () => {
    it('EMAIL: deve falhar com formato de e-mail inválido', () => {
      const payload = {
        email: 'email_invalido.com', // Sem o @
      };

      const { errors } = transformAndValidate(payload);

      const emailError = errors.find(e => e.property === 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints).toHaveProperty('isEmail');
    });

    it('EMAIL: deve falhar se o e-mail não for enviado', () => {
      const payload = {}; // Payload vazio, simulando ausência do campo

      const { errors } = transformAndValidate(payload);

      const emailError = errors.find(e => e.property === 'email');
      expect(emailError).toBeDefined();
      // Como o campo não é opcional no UserRegisterDto base, a ausência
      // deve acionar as restrições de validação herdadas.
      expect(emailError?.constraints).toBeDefined();
    });

    it('EMAIL: deve falhar se o e-mail não for uma string', () => {
      const payload = {
        email: 12345, // Tipo incorreto
      };

      const { errors } = transformAndValidate(payload);

      const emailError = errors.find(e => e.property === 'email');
      expect(emailError).toBeDefined();
      // O SDXProperty infere o tipo automaticamente, então esperamos que
      // a validação falhe por não ser uma string ou falhe no isEmail
      expect(emailError?.constraints).toBeDefined();
    });
  });
});
