import { PickType } from '@nestjs/swagger';
import {
  IsPrismaSortOrder,
  IsPrismaSortOrderInput,
  PrismaPaginationDto,
  PrismaSortOrderInputDto,
  SDXProperty,
  SDXTransformer,
} from 'src/index';

export const TestEnum = { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e' } as const;
export type TestEnum = keyof typeof TestEnum;

export class NestedDto {
  @SDXProperty() property: string;
}

export class TestDTO extends PrismaPaginationDto {
  // ===========================================================================
  // Injeção de validação da tipagem inferida automaticamente
  @SDXProperty() string: string; // Precisa injetar @IsString
  @SDXProperty() number: number; // Precisa injetar @IsNumber
  @SDXProperty() boolean: boolean; // Precisa injetar @IsBoolean
  @SDXProperty() object: object; // Precisa injetar @IsObject
  @SDXProperty() array: unknown[]; // Precisa injetar @IsArray
  @SDXProperty() nested: NestedDto; // Precisa injetar @ValidateNested
  // ---------------------------------------------------------------------------

  //
  // ===========================================================================
  // Injeção de validação a partir das propriedades nativas herdadas do @ApiProperty
  @SDXProperty({ minLength: 3, maxLength: 6 }) string_length: string;
  @SDXProperty({ pattern: '^test:' }) string_pattern: string;
  @SDXProperty({ enum: TestEnum }) string_enum: TestEnum;
  @SDXProperty({ type: 'integer' }) integer: number;
  @SDXProperty({ minimum: 3, maximum: 6 }) number_range: number;
  @SDXProperty({ type: 'integer', minimum: 3 }) integer_range: number;
  @SDXProperty({ type: [Number], minItems: 3, maxItems: 6 })
  array_size: number[];

  @SDXProperty({ type: [Number] }) array_of_numbers: number[];
  @SDXProperty({ required: false }) optional?: boolean;
  @SDXProperty({ nullable: true }) nullable: boolean | null;
  // ---------------------------------------------------------------------------

  //
  // ===========================================================================
  // Injeção de validação personalizada através da propriedade "validators"
  @SDXProperty({ validators: 'IsEmail' }) email: string;
  @SDXProperty({ validators: 'IsPhoneNumber' }) phone: string;
  @SDXProperty({ validators: 'IsUrl' }) url: string;
  @SDXProperty({ validators: 'IsUUID' }) uuid: string;
  @SDXProperty({ validators: 'IsStrongPassword' }) password: string;
  // ---------------------------------------------------------------------------

  //
  // ===========================================================================
  // Injeção de transformação personalizada através da propriedade "transformers"
  @SDXProperty({ transformers: 'ToUppercase' }) uppercase: string;
  @SDXProperty({ transformers: 'ToLowercase' }) lowercase: string;
  @SDXProperty({ transformers: 'ToNormalized' }) normalized: string;
  @SDXProperty({ transformers: 'ToCleanOfSymbols' }) clean_of_symbols: string;
  @SDXProperty({ docType: String, transformers: 'ToParsedJSON' })
  parsed: unknown;

  @SDXProperty({ docType: String })
  @SDXTransformer.StringTo(v => Number(v))
  stringTo: number;

  @SDXProperty({ docType: Number })
  @SDXTransformer.NumberTo(v => `${v}`)
  numberTo: string;

  @SDXProperty({ docType: Boolean })
  @SDXTransformer.BooleanTo(v => `${v}`)
  booleanTo: string;

  @SDXProperty({ docType: 'object' })
  @SDXTransformer.ObjectTo(v => typeof v)
  objectTo: 'object';
  // ---------------------------------------------------------------------------

  //
  // ===========================================================================
  // Valida se a propriedade é um Prisma.SortOrder válido.
  @IsPrismaSortOrder() sortOrder?: 'asc' | 'desc';
  // Transforma uma entrada `value` do tipo string em um objeto { sort: value }.
  // Valida se o resutado é um Prisma.SortOrderInput válido.
  @IsPrismaSortOrderInput() sortOrderInput?: PrismaSortOrderInputDto;
}

export class InjectByInferedTypeDto extends PickType(TestDTO, [
  'string',
  'number',
  'boolean',
  'object',
  'array',
  'nested',
]) {}

export class InjectBySwaggerPropsDto extends PickType(TestDTO, [
  'string_length',
  'string_pattern',
  'string_enum',
  'integer',
  'number_range',
  'integer_range',
  'array_size',
]) {}

export class InjectByValidatorsDto extends PickType(TestDTO, [
  'email',
  'phone',
  'url',
  'uuid',
  'password',
]) {}

export class InjectByTransformerDto extends PickType(TestDTO, [
  'uppercase',
  'lowercase',
  'normalized',
  'clean_of_symbols',
  'parsed',
  'stringTo',
  'numberTo',
  'booleanTo',
  'objectTo',
]) {}
