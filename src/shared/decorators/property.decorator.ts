import { applyDecorators, Logger } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { ValidationOptions } from 'class-validator';

import {
  PropertyDecoratorFn,
  SDX_CLASS_VALIDATOR,
} from '../constants/class-validator-map';
import { SDX_TRANSFORMER } from '../constants/transformer';
import {
  SDX_TYPE_DEACTIVATORS,
  SDXTypeDeactivator,
} from '../constants/type-deactivators';
import {
  SDX_VALIDATOR,
  SDX_VALIDATOR_WITH_INPUT,
} from '../constants/validator';
import { SDXPropertyOptions } from '../types/property-options';
import { SDXValidationConfig } from '../types/validation-config';
import { SDXValidation, SDXValidationWithInput } from '../types/validation-map';

function hasPropertyDecorator(
  checkIn:
    | SDXPropertyOptions['validators']
    | SDXPropertyOptions['transformers'],
) {
  return (
    validator: PropertyDecoratorFn,
    validatorName: SDXValidation | null = null,
    validatorWithInputName: SDXValidationWithInput | null = null,
  ) => {
    let checker: (v: unknown) => boolean;

    if (validatorName || validatorWithInputName) {
      if (validatorName) checker = v => v === validator || v === validatorName;
      else checker = v => v === validator || v === validatorWithInputName;
    } else checker = (v: unknown) => v === validator;

    return (Array.isArray(checkIn) ? checkIn : [checkIn]).some(checker);
  };
}

function addPropertyDecorator<K extends keyof SDXValidationConfig>(
  decorators: PropertyDecorator[],
  checkIn:
    | SDXPropertyOptions['validators']
    | SDXPropertyOptions['transformers'],
  validationOptions: ValidationOptions,
) {
  const hasDecorator = hasPropertyDecorator(checkIn);

  return <P extends K>(
    validator: PropertyDecoratorFn,
    configName: P | null,
    ...args: unknown[]
  ): boolean => {
    if (configName) {
      if (configName in SDX_VALIDATOR) {
        const validatorName = configName as SDXValidation;

        if (hasDecorator(validator, validatorName)) return false;

        const fn = SDX_VALIDATOR[validatorName];
        return !!decorators.push(fn(validationOptions, ...args));
      }

      if (configName in SDX_VALIDATOR_WITH_INPUT) {
        const validatorWithInputName = configName as SDXValidationWithInput;

        if (hasDecorator(validator, null, validatorWithInputName)) return false;

        const fn = SDX_VALIDATOR_WITH_INPUT[validatorWithInputName];
        try {
          return !!decorators.push(fn(args[0], validationOptions));
        } catch (err) {
          Logger.error(
            `Failure to apply ${validatorWithInputName} with args: ` +
              (typeof args[0] === 'object'
                ? JSON.stringify(args[0], null, 2)
                : `${args[0] as any}`),
            err,
          );
          return false;
        }
      }

      return false;
    }

    if (hasDecorator(validator)) return false;

    const fn = validator;
    try {
      return !!decorators.push(fn(...args, validationOptions));
    } catch (err) {
      Logger.error(
        `Failure to apply ${validator.name} with args: ` +
          args
            .map(arg =>
              typeof arg === 'object'
                ? JSON.stringify(arg, null, 2)
                : `${arg as any}`,
            )
            .join(', '),
        err,
      );
      return false;
    }
  };
}

export function SDXProperty(opts: SDXPropertyOptions = {}) {
  return function (target: any, propertyKey: string) {
    // Capitura o tipo da propriedade de forma automática
    const reflectedType = Reflect.getMetadata(
      'design:type',
      target,
      propertyKey,
    );

    // Desestruturação das opções
    const {
      transformers = [],
      transformOptions,
      validators = [],
      validationOptions,
      docType, // tipo que será exibido na documentação
      ignoreTypeValidations,
      ...apiPropertyOptions
    } = opts;

    // Criação de opções internas para manutenção da imutabilidade das entradas
    const _validationOptions: ValidationOptions = { ...validationOptions };
    const _apiPropertyOptions: ApiPropertyOptions = {
      ...apiPropertyOptions,
      type: docType || apiPropertyOptions.type || reflectedType,
    };

    // Lista de decorators
    const decorators: PropertyDecorator[] = [];

    // o tipo atribuído ou capturado
    const { type = reflectedType } = apiPropertyOptions;

    // Verfica se o tipo é um array
    const isArray =
      type === 'array' || Array.isArray(type) || _apiPropertyOptions.isArray;

    // Se for, aplica a propriedade `each: true` para cada validação
    if (isArray) _validationOptions.each = true;

    const hasValidator = hasPropertyDecorator(validators);
    const hasTransformer = hasPropertyDecorator(transformers);

    const addValidator = addPropertyDecorator(
      decorators,
      validators,
      _validationOptions,
    );

    // Objeto de verificação para aplicação de validadores de tipo
    const canApplyValidator = {
      string: true,
      number: true,
      boolean: true,
      object: true,
      array: true,
    };

    /*
      Os decoradores de uma propriedade são lidos sempre de baixo para cima e
      da direita para esquerda. Quando utilizamos o `applyDecoratos`, os
      decoradores são adicionados à propriedade tal qual uma pilha, ou seja, o
      último à entrar é sempre o primeiro a ser lido.
    */

    // Aplicação dos decorators personalizados
    for (const v of Array.isArray(validators) ? validators : [validators]) {
      const [name, fn] =
        typeof v === 'string' ? [v, SDX_VALIDATOR[v]] : [v.name, v];

      // Usamos o SDX_TYPE_DEACTIVATORS (dasativador de tipos) para invalidar a
      // aplicação de validações de tipos desnecessárias, que já ocorrem por
      // baixo dos panos em outros validadores
      if (name in SDX_TYPE_DEACTIVATORS) {
        const { deactivate } = (
          SDX_TYPE_DEACTIVATORS as Record<string, unknown>
        )[name] as SDXTypeDeactivator;
        if (deactivate) canApplyValidator[deactivate] = false;
      }

      decorators.push(fn(_validationOptions));
    }

    /**
     * Aplicação dos decoradores de tipo
     * Aqui, conseguimos que algumas propriedades da documentação Swagger passam
     * à espelhar diretamente as validações.
     */
    if (_apiPropertyOptions.enum) {
      // Um `enum`, nada mais é que uma união de tipos e, portanto, o TS não
      // consegue capturar essa inferência automaticamente, aferindo `object` no
      // lugar do `enum`.
      addValidator(SDX_CLASS_VALIDATOR.IsEnum, 'IsEnum', [
        _apiPropertyOptions.enum,
      ]);
    } else if (ignoreTypeValidations) {
      // Não aplica validações de tipo
      //
      // Isso é útil para quando recebemos um valor de um tipo e transformamos
      // em outro tipo manualmente. Ex. Se recebemos uma string que pode ser um
      // email ou um cpf e transformamos em um objeto com as propriedades
      // `email` ou `cpf`, não queremos passar o objeto para a documentação, nem
      // uma validação @IsString depois de já termos transformado o objeto.
    } else if (type === String || type === 'string') {
      const { maxLength, minLength } = _apiPropertyOptions;

      if (maxLength || minLength) {
        if (maxLength)
          addValidator(SDX_CLASS_VALIDATOR.MaxLength, 'MaxLength', [maxLength]);

        if (minLength)
          addValidator(SDX_CLASS_VALIDATOR.MinLength, 'MinLength', [minLength]);
      } else if (
        !hasValidator(SDX_CLASS_VALIDATOR.Length, null, 'Length') &&
        canApplyValidator.string
      ) {
        addValidator(SDX_CLASS_VALIDATOR.IsString, 'IsString');
      }
    } else if (type === Number || type === 'number' || type === 'integer') {
      const { maximum, minimum } = _apiPropertyOptions;

      if (maximum || minimum) {
        if (minimum) addValidator(SDX_CLASS_VALIDATOR.Min, 'Min', [minimum]);
        if (maximum) addValidator(SDX_CLASS_VALIDATOR.Max, 'Max', [maximum]);
      } else if (type === 'integer') {
        addValidator(SDX_CLASS_VALIDATOR.IsInt, 'IsInt');
      } else if (canApplyValidator.number) {
        addValidator(SDX_CLASS_VALIDATOR.IsNumber, 'IsNumber');
      }
    } else if (type === Boolean || type === 'boolean') {
      addValidator(SDX_CLASS_VALIDATOR.IsBoolean, 'IsBoolean');
    } else if (type === Object || type === 'object') {
      if (canApplyValidator.object)
        addValidator(SDX_CLASS_VALIDATOR.IsObject, 'IsObject');
    } else if (isArray) {
      const { maxItems, minItems } = _apiPropertyOptions;

      if (maxItems || minItems) {
        if (maxItems)
          addValidator(SDX_CLASS_VALIDATOR.ArrayMaxSize, 'ArrayMaxSize', [
            maxItems,
          ]);

        if (minItems)
          addValidator(SDX_CLASS_VALIDATOR.ArrayMinSize, 'ArrayMinSize', [
            minItems,
          ]);
      } else if (canApplyValidator.array) {
        addValidator(SDX_CLASS_VALIDATOR.IsArray, 'IsArray');
      }
    } else if (typeof type !== 'string') {
      addValidator(SDX_CLASS_VALIDATOR.ValidateNested, 'ValidateNested');

      if (!hasTransformer(Type as PropertyDecoratorFn))
        decorators.push(Type(() => type as Function));
    }

    // Aplicação de @IsOptional que permite entradas `undefined`
    if (_apiPropertyOptions.required === false)
      addValidator(SDX_CLASS_VALIDATOR.IsOptional, 'IsOptional');

    // Aplicação de @ValidateIf que permite entradas `null`
    if (_apiPropertyOptions.nullable)
      // Aqui usamos `decorators.push` pois não queremos que essa validação seja
      // bloqueada por outros `@ValidateIf` que o dev insira
      decorators.push(
        SDX_CLASS_VALIDATOR.ValidateIf(
          ({ value }: { value: unknown }) => value !== null,
        ),
      );

    // Aplicação dos transformadores customizados
    for (const t of Array.isArray(transformers)
      ? transformers
      : [transformers]) {
      const fn =
        typeof t === 'string' ? (SDX_TRANSFORMER[t] as PropertyDecoratorFn) : t;
      decorators.push(fn(transformOptions));
    }

    // Aplicação na propriedade.
    //
    // Aqui estamos documentando a propriedade antes de realizar qualquer
    // validação.
    return applyDecorators(...decorators, ApiProperty(_apiPropertyOptions))(
      target,
      propertyKey,
    );
  };
}
