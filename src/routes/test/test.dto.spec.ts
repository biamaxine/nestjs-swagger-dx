import { SDXValidationModule } from 'src/index';

SDXValidationModule.setup({
  IsEmail: { options: { host_whitelist: ['example.com'] } },
  IsPhoneNumber: { region: 'BR' },
  IsUrl: { options: { host_whitelist: ['example.com'] } },
  IsUUID: { version: '4' },
});

import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import {
  InjectByInferedTypeDto,
  InjectBySwaggerPropsDto,
  InjectByTransformerDto,
  InjectByValidatorsDto,
  TestDTO,
} from './test.dto';

describe('Testes de Validação e Transformação (SDXProperty)', () => {
  const body = {
    page: 4,
    limit: 12,

    string: 'test',
    number: 1,
    boolean: true,
    object: new Object({}),
    array: [],
    nested: { property: 'test' },

    string_length: 'test',
    string_pattern: 'test:ok',
    string_enum: 'a',
    integer: 1,
    number_range: 3.5,
    integer_range: 3,
    array_size: [1, 2, 3, 4, 5],
    array_of_numbers: [1, 2, 3, 4],
    optional: undefined,
    nullable: null,

    email: 'fulano.tal@example.com',
    phone: '(92) 9 8765-4321',
    url: 'https://example.com',
    uuid: '5f629ed3-a29c-4bc6-8630-fa95f5b080d9',
    password: 'Senha@123',

    uppercase: 'texto maiúsculo',
    lowercase: 'TEXTO MINÚSCULO',
    normalized: '    texto     normalizado  ',
    clean_of_symbols: '123.456.789-09',

    parsed: '{"prop":"a"}',

    stringTo: '1.5',
    numberTo: 1.5,
    booleanTo: true,
    objectTo: { prop: 'a' },

    sortOrder: 'desc',
    sortOrderInput: { sort: 'asc', nulls: 'first' },
  };

  describe('TestDTO (Classe Principal)', () => {
    describe('Quando o corpo da requisição é válido: ', () => {
      let dto: TestDTO;
      let errors: ValidationError[];

      beforeEach(() => {
        dto = plainToInstance(TestDTO, body);
        errors = validateSync(dto);
      });

      it('Validação passou sem acusar erros?', () => {
        expect(errors.length).toBe(0);
      });

      it('dto.uppercase foi transformado em maiúsculas?', () => {
        expect(dto.uppercase).toBe('TEXTO MAIÚSCULO');
      });

      it('dto.lowercase foi transformado em minúsculas?', () => {
        expect(dto.lowercase).toBe('texto minúsculo');
      });

      it('dto.normalized foi normalizado?', () => {
        expect(dto.normalized).toBe('texto normalizado');
      });

      it('dto.clean_of_symbols foi limpo de todos os símbolos?', () => {
        expect(dto.clean_of_symbols).toBe('12345678909');
      });

      it('dto.parsed foi parseado para um objeto?', () => {
        expect(dto.parsed).toEqual({ prop: 'a' });
      });

      it('dto.stringTo transforma a string em número?', () => {
        expect(dto.stringTo).toBe(1.5);
      });

      it('dto.numberTo transforma o número em string?', () => {
        expect(dto.numberTo).toBe('1.5');
      });

      it('dto.booleanTo transforma o booleano em string?', () => {
        expect(dto.booleanTo).toBe('true');
      });

      it('dto.objectTo transforma o objeto na string "object"?', () => {
        expect(dto.objectTo).toBe('object');
      });

      it('dto.sortOrderInput do tipo string foi transformado em um SortOrderInput?', () => {
        dto = plainToInstance(TestDTO, { ...body, sortOrderInput: 'desc' });
        expect(dto.sortOrderInput).toEqual({ sort: 'desc' });
      });

      it('dto.skip calcula com base no valor da página?', () => {
        expect(dto.skip).toBe((body.page - 1) * body.limit);
      });

      it('dto.take retorna o valor definido?', () => {
        expect(dto.take).toBe(body.limit);
      });
    });

    describe('Quando o corpo da requisição é inválido: ', () => {
      let dto: TestDTO;
      let errors: ValidationError[];

      beforeEach(() => {
        dto = plainToInstance(TestDTO, {
          ...body,

          page: 0,
          limit: 1.5,

          string: 1,
          number: 'invalid',
          boolean: 'invalid',
          object: 'invalid',
          array: 'invalid',

          string_pattern: 'invalid',
          string_enum: 'invalid',
          integer: 1.5,
          integer_range: 1.5,
          array_of_numbers: ['a', 'b', 'c'],

          optional: null,
          nullable: undefined,

          email: 'fulano.tal@gmail.com', // Domínio inválido
          phone: '+86 138 1234 5678', // Região inválida
          url: 'https://google.com', // Domínio inválido
          uuid: '019d2a7f-e553-7c3b-b5a6-ad428c04a09f', // UUID v7
          password: 'Senha', // Senha Fraca

          sortOrder: 'invalid',
          sortOrderInput: 'invalid',
        });
        errors = validateSync(dto);
      });

      it('Validação recusou o corpo por conta de entradas inválidas?', () => {
        expect(errors.length).toBeGreaterThan(0);
      });

      it('dto.string foi rejeitado por não ser uma string?', () => {
        const err = errors.find(e => e.property === 'string');
        expect(err?.constraints).toHaveProperty('isString');
      });

      it('dto.number foi rejeitado por não ser um number?', () => {
        const err = errors.find(e => e.property === 'number');
        expect(err?.constraints).toHaveProperty('isNumber');
      });

      it('dto.boolean foi rejeitado por não ser um boolean?', () => {
        const err = errors.find(e => e.property === 'boolean');
        expect(err?.constraints).toHaveProperty('isBoolean');
      });

      it('dto.object foi rejeitado por não ser um object?', () => {
        const err = errors.find(e => e.property === 'object');
        expect(err?.constraints).toHaveProperty('isObject');
      });

      it('dto.array foi rejeitado por não ser um array?', () => {
        const err = errors.find(e => e.property === 'array');
        expect(err?.constraints).toHaveProperty('isArray');
      });

      describe('dto.nested: ', () => {
        it('Foi rejeitado por receber um valor de outro tipo que não object?', () => {
          dto = plainToInstance(TestDTO, { ...body, nested: 'test' });
          const err = validateSync(dto).find(e => e.property === 'nested');
          expect(err?.constraints).toHaveProperty('nestedValidation');
        });

        it('Foi rejeitado por sua "property" não ser uma string?', () => {
          dto = plainToInstance(TestDTO, { ...body, nested: { property: 1 } });
          const err = validateSync(dto).find(e => e.property === 'nested');
          expect(err?.children?.[0].constraints).toHaveProperty('isString');
        });
      });

      describe('dto.string_length: ', () => {
        it('Foi rejeitado por ser menor que "minLength"?', () => {
          const string_length = 'a';
          dto = plainToInstance(TestDTO, { ...body, string_length });
          const err = validateSync(dto).find(
            e => e.property === 'string_length',
          );
          expect(err?.constraints).toHaveProperty('minLength');
        });

        it('Foi rejeitado por ser maior que "maxLength"?', () => {
          const string_length = 'a'.repeat(7);
          dto = plainToInstance(TestDTO, { ...body, string_length });
          const err = validateSync(dto).find(
            e => e.property === 'string_length',
          );
          expect(err?.constraints).toHaveProperty('maxLength');
        });
      });

      it('dto.string_pattern foi rejeitado por não atender ao padrão?', () => {
        const err = errors.find(e => e.property === 'string_pattern');
        expect(err?.constraints).toHaveProperty('matches');
      });

      it('dto.string_enum foi rejeitado por não pertencer ao TestEnum?', () => {
        const err = errors.find(e => e.property === 'string_enum');
        expect(err?.constraints).toHaveProperty('isEnum');
      });

      it('dto.integer foi rejeitado por não ser um inteiro?', () => {
        const err = errors.find(e => e.property === 'integer');
        expect(err?.constraints).toHaveProperty('isInt');
      });

      describe('dto.number_range: ', () => {
        it('Foi rejeitado por ser menor que "minimum"?', () => {
          dto = plainToInstance(TestDTO, { ...body, number_range: 1 });
          const err = validateSync(dto).find(
            e => e.property === 'number_range',
          );
          expect(err?.constraints).toHaveProperty('min');
        });
        it('Foi rejeitado por ser maior que "maximum"?', () => {
          dto = plainToInstance(TestDTO, { ...body, number_range: 7 });
          const err = validateSync(dto).find(
            e => e.property === 'number_range',
          );
          expect(err?.constraints).toHaveProperty('max');
        });
      });

      it('dto.integer_range foi rejeitado por não ser um inteiro?', () => {
        const err = errors.find(e => e.property === 'integer_range');
        expect(err?.constraints).toHaveProperty('isInt');
      });

      it('dto.integer_range por ser menor que "minimum"', () => {
        const err = errors.find(e => e.property === 'integer_range');
        expect(err?.constraints).toHaveProperty('min');
      });

      describe('dto.array_size:', () => {
        it('Foi rejeitado por ter menos itens que "minItems"?', () => {
          const array_size = [];
          dto = plainToInstance(TestDTO, { ...body, array_size });
          const err = validateSync(dto).find(e => e.property === 'array_size');
          expect(err?.constraints).toHaveProperty('arrayMinSize');
        });

        it('Foi rejeitado por ter mais itens que "maxItems"?', () => {
          const array_size = Array.from({ length: 7 });
          dto = plainToInstance(TestDTO, { ...body, array_size });
          const err = validateSync(dto).find(e => e.property === 'array_size');
          expect(err?.constraints).toHaveProperty('arrayMaxSize');
        });
      });

      it('dto.array_of_numbers foi rejeitado por não ser um array de números?', () => {
        const err = errors.find(e => e.property === 'array_of_numbers');
        expect(err?.constraints).toHaveProperty('isNumber');
      });

      it('dto.email foi rejeitado por não pertencer ao domínio definido?', () => {
        const err = errors.find(e => e.property === 'email');
        expect(err?.constraints).toHaveProperty('isEmail');
      });

      it('dto.phone foi rejeitado por não ser um telefone brasileiro?', () => {
        const err = errors.find(e => e.property === 'phone');
        expect(err?.constraints).toHaveProperty('isPhoneNumber');
      });

      it('dto.url foi rejeitado por não pertencer ao domínio definido?', () => {
        const err = errors.find(e => e.property === 'url');
        expect(err?.constraints).toHaveProperty('isUrl');
      });

      it('dto.uuid foi rejeitado por não ter sido gerada pela versão 4?', () => {
        const err = errors.find(e => e.property === 'uuid');
        expect(err?.constraints).toHaveProperty('isUuid');
      });

      it('dto.password foi rejeitado por não ser uma senha forte?', () => {
        const err = errors.find(e => e.property === 'password');
        expect(err?.constraints).toHaveProperty('isStrongPassword');
      });

      it('dto.page foi rejeitado por ser menor que 1?', () => {
        const err = errors.find(e => e.property === 'page');
        expect(err?.constraints).toHaveProperty('min');
      });

      it('dto.limit foi rejeitado por não ser um inteiro?', () => {
        const err = errors.find(e => e.property === 'limit');
        expect(err?.constraints).toHaveProperty('isInt');
      });

      it('dto.sortOrder foi rejeitado por não ser nem "asc" e nem "desc"?', () => {
        const err = errors.find(e => e.property === 'sortOrder');
        expect(err?.constraints).toHaveProperty('isEnum');
      });

      describe('dto.sortOrderInput: ', () => {
        const prop = 'sortOrderInput';

        it('Foi rejeitado por receber uma string que não é "asc" nem "desc"?', () => {
          const err = errors.find(e => e.property === prop);
          expect(err?.children?.[0].property).toBe('sort');
          expect(err?.children?.[0].constraints).toHaveProperty('isEnum');
        });

        it('Foi rejeitado por receber um objeto com a propriedade "sort" inválida?', () => {
          const sortOrderInput = { sort: 'outra_coisa', nulls: 'last' };
          dto = plainToInstance(TestDTO, { ...body, sortOrderInput });
          const err = validateSync(dto).find(e => e.property === prop);
          expect(err?.children?.[0].property).toBe('sort');
          expect(err?.children?.[0].constraints).toHaveProperty('isEnum');
        });

        it('Foi rejeitado por receber um objeto com a propriedade "nulls" inválida?', () => {
          const sortOrderInput = { sort: 'asc', nulls: 'invalid_nulls' };
          dto = plainToInstance(TestDTO, { ...body, sortOrderInput });
          const err = validateSync(dto).find(e => e.property === prop);
          expect(err?.children?.[0].property).toBe('nulls');
          expect(err?.children?.[0].constraints).toHaveProperty('isEnum');
        });
      });
    });

    describe('Metadados de Documentação (docType): ', () => {
      const getSwaggerMetaType = (targetClass: any, propertyKey: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Reflect.getMetadata(
          'swagger/apiModelProperties',
          targetClass.prototype,
          propertyKey,
        )?.type;
      };

      it('O docType alterou a documentação da propriedade "parsed" para String?', () => {
        expect(getSwaggerMetaType(TestDTO, 'parsed')).toBe(String);
      });

      it('O docType alterou a documentação da propriedade "stringTo" para String?', () => {
        expect(getSwaggerMetaType(TestDTO, 'stringTo')).toBe(String);
      });

      it('O docType alterou a documentação da propriedade "numberTo" para Number?', () => {
        expect(getSwaggerMetaType(TestDTO, 'numberTo')).toBe(Number);
      });

      it('O docType alterou a documentação da propriedade "booleanTo" para Boolean?', () => {
        expect(getSwaggerMetaType(TestDTO, 'booleanTo')).toBe(Boolean);
      });

      it('O docType alterou a documentação da propriedade "objectTo" para "object"?', () => {
        expect(getSwaggerMetaType(TestDTO, 'objectTo')).toBe('object');
      });
    });
  });

  describe('InjectByInferedTypeDto (Herança com PickType): ', () => {
    let errors: ValidationError[];

    beforeEach(() => {
      const dto = plainToInstance(InjectByInferedTypeDto, {
        string: 1,
        number: 'invalid',
        boolean: 'invalid',
        object: 'invalid',
        array: 'invalid',
        nested: 'invalid',
      });
      errors = validateSync(dto);
    });

    it('A herança manteve a injeção do @IsString na propriedade "string"?', () => {
      const err = errors.find(e => e.property === 'string');
      expect(err?.constraints).toHaveProperty('isString');
    });

    it('A herança manteve a injeção do @IsNumber na propriedade "number"?', () => {
      const err = errors.find(e => e.property === 'number');
      expect(err?.constraints).toHaveProperty('isNumber');
    });

    it('A herança manteve a injeção do @IsBoolean na propriedade "boolean"?', () => {
      const err = errors.find(e => e.property === 'boolean');
      expect(err?.constraints).toHaveProperty('isBoolean');
    });

    it('A herança manteve a injeção do @IsObject na propriedade "object"?', () => {
      const err = errors.find(e => e.property === 'object');
      expect(err?.constraints).toHaveProperty('isObject');
    });

    it('A herança manteve a injeção do @IsArray na propriedade "array"?', () => {
      const err = errors.find(e => e.property === 'array');
      expect(err?.constraints).toHaveProperty('isArray');
    });

    it('A herança manteve a injeção do @ValidateNested na propriedade "nested"?', () => {
      const err = errors.find(e => e.property === 'nested');
      expect(err?.constraints).toHaveProperty('nestedValidation');
    });
  });

  describe('InjectBySwaggerPropsDto (Herança com PickType): ', () => {
    let errors: ValidationError[];

    beforeEach(() => {
      const dto = plainToInstance(InjectBySwaggerPropsDto, {
        string_length: 'a',
        string_pattern: 'invalid',
        string_enum: 'invalid',
        integer: 1.5,
        number_range: 1,
        integer_range: 1.5,
        array_size: [],
      });
      errors = validateSync(dto);
    });

    it('A herança manteve a injeção do @MinLength na propriedade "string_length"?', () => {
      const err = errors.find(e => e.property === 'string_length');
      expect(err?.constraints).toHaveProperty('minLength');
    });

    it('A herança manteve a injeção do @Matches na propriedade "string_pattern"?', () => {
      const err = errors.find(e => e.property === 'string_pattern');
      expect(err?.constraints).toHaveProperty('matches');
    });

    it('A herança manteve a injeção do @IsEnum na propriedade "string_enum"?', () => {
      const err = errors.find(e => e.property === 'string_enum');
      expect(err?.constraints).toHaveProperty('isEnum');
    });

    it('A herança manteve a injeção do @IsInt na propriedade "integer"?', () => {
      const err = errors.find(e => e.property === 'integer');
      expect(err?.constraints).toHaveProperty('isInt');
    });

    it('A herança manteve a injeção do @Min na propriedade "number_range"?', () => {
      const err = errors.find(e => e.property === 'number_range');
      expect(err?.constraints).toHaveProperty('min');
    });

    it('A herança manteve a injeção do @IsInt na propriedade "integer_range"?', () => {
      const err = errors.find(e => e.property === 'integer_range');
      expect(err?.constraints).toHaveProperty('isInt');
    });

    it('A herança manteve a injeção do @ArrayMinSize na propriedade "array_size"?', () => {
      const err = errors.find(e => e.property === 'array_size');
      expect(err?.constraints).toHaveProperty('arrayMinSize');
    });
  });

  describe('InjectByValidatorsDto (Herança com PickType): ', () => {
    let errors: ValidationError[];

    beforeEach(() => {
      const dto = plainToInstance(InjectByValidatorsDto, {
        email: 'invalid_email',
        phone: 'invalid_phone',
        url: 'invalid_url',
        uuid: 'invalid_uuid',
        password: 'weak',
      });
      errors = validateSync(dto);
    });

    it('A herança manteve a injeção do @IsEmail na propriedade "email"?', () => {
      const err = errors.find(e => e.property === 'email');
      expect(err?.constraints).toHaveProperty('isEmail');
    });

    it('A herança manteve a injeção do @IsPhoneNumber na propriedade "phone"?', () => {
      const err = errors.find(e => e.property === 'phone');
      expect(err?.constraints).toHaveProperty('isPhoneNumber');
    });

    it('A herança manteve a injeção do @IsUrl na propriedade "url"?', () => {
      const err = errors.find(e => e.property === 'url');
      expect(err?.constraints).toHaveProperty('isUrl');
    });

    it('A herança manteve a injeção do @IsUUID na propriedade "uuid"?', () => {
      const err = errors.find(e => e.property === 'uuid');
      expect(err?.constraints).toHaveProperty('isUuid');
    });

    it('A herança manteve a injeção do @IsStrongPassword na propriedade "password"?', () => {
      const err = errors.find(e => e.property === 'password');
      expect(err?.constraints).toHaveProperty('isStrongPassword');
    });
  });

  describe('InjectByTransformerDto (Herança com PickType): ', () => {
    let dto: InjectByTransformerDto;

    beforeEach(() => {
      dto = plainToInstance(InjectByTransformerDto, {
        uppercase: 'texto maiúsculo',
        lowercase: 'TEXTO MINÚSCULO',
        normalized: '    texto     normalizado  ',
        clean_of_symbols: '123.456.789-09',
        parsed: '{"prop":"a"}',
        stringTo: '1.5',
        numberTo: 1.5,
        booleanTo: true,
        objectTo: { prop: 'a' },
      });
    });

    it('A herança manteve o transformador "ToUppercase" na propriedade "uppercase"?', () => {
      expect(dto.uppercase).toBe('TEXTO MAIÚSCULO');
    });

    it('A herança manteve o transformador "ToLowercase" na propriedade "lowercase"?', () => {
      expect(dto.lowercase).toBe('texto minúsculo');
    });

    it('A herança manteve o transformador "ToNormalized" na propriedade "normalized"?', () => {
      expect(dto.normalized).toBe('texto normalizado');
    });

    it('A herança manteve o transformador "ToCleanOfSymbols" na propriedade "clean_of_symbols"?', () => {
      expect(dto.clean_of_symbols).toBe('12345678909');
    });

    it('A herança manteve o transformador "ToParsedJSON" na propriedade "parsed"?', () => {
      expect(dto.parsed).toEqual({ prop: 'a' });
    });

    it('A herança manteve o transformador "StringTo" na propriedade "stringTo"?', () => {
      expect(dto.stringTo).toBe(1.5);
    });

    it('A herança manteve o transformador "NumberTo" na propriedade "numberTo"?', () => {
      expect(dto.numberTo).toBe('1.5');
    });

    it('A herança manteve o transformador "BooleanTo" na propriedade "booleanTo"?', () => {
      expect(dto.booleanTo).toBe('true');
    });

    it('A herança manteve o transformador "ObjectTo" na propriedade "objectTo"?', () => {
      expect(dto.objectTo).toBe('object');
    });
  });
});
