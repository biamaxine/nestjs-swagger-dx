import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { SDXValidationModule } from 'src/shared/modules/validation.module';

// IMPORTANTE: Configuração global antes do DTO ser avaliado pelo TypeScript
SDXValidationModule.setup({ IsPhoneNumber: { region: 'BR' } });

import { UserUpdateOneDto } from './user-update-one.dto';
import { UserRole } from '../entities/user.model';

describe('UserUpdateOneDto', () => {
  // Função auxiliar para simular o comportamento do ValidationPipe
  const transformAndValidate = (payload: any) => {
    const dtoInstance = plainToInstance(UserUpdateOneDto, payload);
    const errors = validateSync(dtoInstance);
    return { dtoInstance, errors };
  };

  describe('Caminho Feliz e Transformações', () => {
    it('deve passar na validação com todos os dados válidos e aplicar transformações', () => {
      const payload = {
        cpf: '123.456.789-00', // Com máscara
        email: 'novo_email@email.com',
        phone: '(11) 98765-4321', // Com máscara
        role: UserRole.moderator,
      };

      const { dtoInstance, errors } = transformAndValidate(payload);

      // Verificando transformações do ToCleanOfSymbols herdadas
      expect(dtoInstance.cpf).toBe('12345678900');
      expect(dtoInstance.phone).toBe('11987654321');

      // Verificando os demais campos
      expect(dtoInstance.email).toBe('novo_email@email.com');
      expect(dtoInstance.role).toBe(UserRole.moderator);

      expect(errors.length).toBe(0);
    });

    it('deve passar na validação com payload vazio (todos os campos são opcionais)', () => {
      // Como usamos PartialType para o CPF, o email e o phone vêm de um PartialType e o role é required: false
      const { errors } = transformAndValidate({});
      expect(errors.length).toBe(0);
    });

    it('deve permitir que o telefone seja nulo (herdado do UserUpdateMeDto)', () => {
      const { errors } = transformAndValidate({ phone: null });
      expect(errors.length).toBe(0);
    });
  });

  describe('Validações de Campo (Erros Esperados)', () => {
    it('CPF: deve falhar se tiver tamanho inválido (herdado de UserRegisterDto)', () => {
      const { errors } = transformAndValidate({ cpf: '123.456.789' }); // Faltam dígitos
      const cpfError = errors.find(e => e.property === 'cpf');

      expect(cpfError).toBeDefined();
      expect(cpfError?.constraints).toHaveProperty('minLength');
    });

    it('EMAIL: deve falhar com formato inválido (herdado de UserRegisterDto)', () => {
      const { errors } = transformAndValidate({ email: 'usuario_sem_dominio' });
      const emailError = errors.find(e => e.property === 'email');

      expect(emailError).toBeDefined();
      expect(emailError?.constraints).toHaveProperty('isEmail');
    });

    it('PHONE: deve falhar se for um telefone inválido (herdado de UserUpdateMeDto)', () => {
      const { errors } = transformAndValidate({ phone: '123' }); // Número muito curto
      const phoneError = errors.find(e => e.property === 'phone');

      expect(phoneError).toBeDefined();
      expect(phoneError?.constraints).toHaveProperty('isPhoneNumber');
    });

    it('ROLE: deve falhar se não pertencer aos enumeradores do UserRole', () => {
      const { errors } = transformAndValidate({ role: 'cargo_inexistente' });
      const roleError = errors.find(e => e.property === 'role');

      expect(roleError).toBeDefined();
      // Como passamos a propriedade `enum` no SDXProperty, ele injetou automaticamente o @IsEnum()
      expect(roleError?.constraints).toHaveProperty('isEnum');
    });
  });
});
