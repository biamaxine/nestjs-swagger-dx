import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { UserSignInDto } from './user-sign-in.dto';

describe('UserSignInDto', () => {
  // Função auxiliar para simular o comportamento do ValidationPipe
  const transformAndValidate = (payload: any) => {
    const dtoInstance = plainToInstance(UserSignInDto, payload);
    const errors = validateSync(dtoInstance);
    return { dtoInstance, errors };
  };

  const validPassword = 'StrongPassword@123';

  describe('Caminho Feliz e Transformações (Polimorfismo)', () => {
    it('deve transformar uma string com "@" em um e-mail válido no UserLoginDto', () => {
      const payload = {
        login: 'joao@email.com',
        password: validPassword,
      };

      const { dtoInstance, errors } = transformAndValidate(payload);

      // Verifica se a transformação instanciou corretamente o objeto aninhado
      expect(dtoInstance.login).toBeDefined();
      expect(dtoInstance.login.email).toBe('joao@email.com');
      expect(dtoInstance.login.cpf).toBeUndefined();

      expect(errors.length).toBe(0);
    });

    it('deve transformar uma string sem "@" em um CPF limpo no UserLoginDto', () => {
      const payload = {
        login: '123.456.789-00', // CPF com máscara
        password: validPassword,
      };

      const { dtoInstance, errors } = transformAndValidate(payload);

      // Verifica se a transformação alocou para CPF e se o ToCleanOfSymbols rodou
      expect(dtoInstance.login).toBeDefined();
      expect(dtoInstance.login.cpf).toBe('12345678900');
      expect(dtoInstance.login.email).toBeUndefined();

      expect(errors.length).toBe(0);
    });
  });

  describe('Validações de Campo (Erros Esperados)', () => {
    it('LOGIN (EMAIL): deve falhar se o e-mail aninhado for inválido', () => {
      const { errors } = transformAndValidate({
        login: 'joao@invalido', // Possui '@', vai para email, mas é inválido
        password: validPassword,
      });

      // Como é uma validação aninhada (@ValidateNested), o erro fica em 'children'
      const loginError = errors.find(e => e.property === 'login');
      expect(loginError).toBeDefined();

      const emailError = loginError?.children?.find(
        e => e.property === 'email',
      );
      expect(emailError).toBeDefined();
      expect(emailError?.constraints).toHaveProperty('isEmail');
    });

    it('LOGIN (CPF): deve falhar se o CPF aninhado não tiver 11 dígitos', () => {
      const { errors } = transformAndValidate({
        login: '123.456', // Não possui '@', vai para CPF, mas é muito curto
        password: validPassword,
      });

      const loginError = errors.find(e => e.property === 'login');
      expect(loginError).toBeDefined();

      const cpfError = loginError?.children?.find(e => e.property === 'cpf');
      expect(cpfError).toBeDefined();
      expect(cpfError?.constraints).toHaveProperty('minLength');
    });

    it('PASSWORD: deve falhar se a senha estiver vazia', () => {
      const { errors } = transformAndValidate({
        login: 'joao@email.com',
        password: '',
      });

      const passwordError = errors.find(e => e.property === 'password');
      expect(passwordError).toBeDefined();
      expect(passwordError?.constraints).toHaveProperty('isNotEmpty');
    });
  });
});
