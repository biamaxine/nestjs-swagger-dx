import { applyDecorators, Logger } from '@nestjs/common';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { ValidationOptions } from 'class-validator';

import {
  PropertyDecoratorFn,
  SDXClassValidatorMap,
} from '../constants/class-validator-map';
import { SDXTransformer } from '../constants/transformer';
import {
  SDX_TYPE_DEACTIVATORS,
  SDXTypeDeactivator,
} from '../constants/type-deactivators';
import { SDXValidator } from '../constants/validator';
import { SDXValidationModule } from '../modules/validation.module';
import { SDXPropertyOptions } from '../types/property-options';
import { SDXValidationConfig } from '../types/validation-config';
import { SDXValidation } from '../types/validation-map';

function hasPropertyDecorator(
  checkIn:
    | SDXPropertyOptions['validators']
    | SDXPropertyOptions['transformers'],
) {
  return (
    validator: PropertyDecoratorFn,
    name: SDXValidation | null = null,
  ) => {
    const checker = (v: unknown) => v === validator || (name && v === name);
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
    validatorName: SDXValidation | null,
    configName: P | null,
    ...args: unknown[]
  ): boolean => {
    if (hasDecorator(validator, validatorName)) return false;

    if (configName && configName in SDXValidator) {
      const fn = (SDXValidator as any)[configName] as PropertyDecoratorFn;
      return !!decorators.push(fn(validationOptions, ...args));
    }

    const { validationOptions: configValidationOptions, ...configArgs } =
      (configName ? SDXValidationModule._getConfig()[configName] : undefined) ||
      {};

    const _validationOptions = {
      ...configValidationOptions,
      ...validationOptions,
    };

    const options =
      configName &&
      configArgs &&
      ((configArgs as any)['options'] as SDXValidationConfig[K] extends {
        options: infer O;
      }
        ? O
        : null);

    if (options) {
      try {
        const _options = { ...options, ...(args[0] ? args[0] : {}) };
        const propertyDecorator = validator(_options, _validationOptions);
        return !!decorators.push(propertyDecorator);
      } catch (err) {
        Logger.error(
          `Failure to calling validator ${validator.name} with the options: ` +
            JSON.stringify(options, null, 2),
          err,
        );
        return false;
      }
    }

    try {
      const configValues = Object.values(configArgs);
      const range = Math.max(args.length, configValues.length);
      const _args = Array.from({ length: range }).map((_, i) =>
        args[i] !== undefined ? args[i] : configValues[i],
      );
      const propertyDecorator = validator(..._args, _validationOptions);
      return !!decorators.push(propertyDecorator);
    } catch (err) {
      Logger.error(
        `Failure to calling validator ${validator.name} with the args: ` +
          args.join(', '),
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
        typeof v === 'string' ? [v, SDXValidator[v]] : [v.name, v];

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

    if (_apiPropertyOptions.enum) {
      addValidator(
        SDXClassValidatorMap.IsEnum,
        null,
        'IsEnum',
        _apiPropertyOptions.enum,
      );
    }

    /**
     * Aplicação dos decoradores de tipo
     *
     * Aqui, conseguimos que algumas propriedades da documentação Swagger passam
     * à espelhar diretamente as validações.
     */
    if (ignoreTypeValidations) {
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
          addValidator(
            SDXClassValidatorMap.MaxLength,
            null,
            'MaxLength',
            maxLength,
          );

        if (minLength)
          addValidator(
            SDXClassValidatorMap.MinLength,
            null,
            'MinLength',
            minLength,
          );
      } else if (
        !hasValidator(SDXClassValidatorMap.Length, null) &&
        canApplyValidator.string
      ) {
        addValidator(SDXClassValidatorMap.IsString, null, 'IsString');
      }
    } else if (type === 'integer') {
      addValidator(SDXClassValidatorMap.IsInt, null, 'IsInt');
    } else if (type === Number || type === 'number') {
      const { maximum, minimum } = _apiPropertyOptions;

      if (maximum || minimum) {
        if (maximum)
          addValidator(SDXClassValidatorMap.Max, null, 'Max', maximum);

        if (minimum)
          addValidator(SDXClassValidatorMap.Min, null, 'Min', minimum);
      } else if (canApplyValidator.number) {
        addValidator(SDXClassValidatorMap.IsNumber, null, 'IsNumber');
      }
    } else if (type === Boolean || type === 'boolean') {
      addValidator(SDXClassValidatorMap.IsBoolean, null, 'IsBoolean');
    } else if (type === Object || type === 'object') {
      if (canApplyValidator.object)
        addValidator(SDXClassValidatorMap.IsObject, null, 'IsObject');
    } else if (isArray) {
      const { maxItems, minItems } = _apiPropertyOptions;

      if (maxItems || minItems) {
        if (maxItems)
          addValidator(
            SDXClassValidatorMap.ArrayMaxSize,
            null,
            'ArrayMaxSize',
            maxItems,
          );

        if (minItems)
          addValidator(
            SDXClassValidatorMap.ArrayMinSize,
            null,
            'ArrayMinSize',
            minItems,
          );
      } else if (canApplyValidator.array) {
        addValidator(SDXClassValidatorMap.IsArray, null, 'IsArray');
      }
    } else if (typeof type !== 'string') {
      addValidator(SDXClassValidatorMap.ValidateNested, null, 'ValidateNested');

      if (!hasTransformer(Type as PropertyDecoratorFn))
        decorators.push(Type(() => type as Function));
    }

    // Aplicação de @IsOptional que permite entradas `undefined`
    if (_apiPropertyOptions.required === false)
      addValidator(SDXClassValidatorMap.IsOptional, null, 'IsOptional');

    // Aplicação de @ValidateIf que permite entradas `null`
    if (_apiPropertyOptions.nullable)
      // Aqui usamos `decorators.push` pois não queremos que essa validação seja
      // bloqueada por outros `@ValidateIf` que o dev insira
      decorators.push(
        SDXClassValidatorMap.ValidateIf(
          ({ value }: { value: unknown }) => value !== null,
        ),
      );

    // Aplicação dos transformadores customizados
    for (const t of Array.isArray(transformers)
      ? transformers
      : [transformers]) {
      const fn =
        typeof t === 'string' ? (SDXTransformer[t] as PropertyDecoratorFn) : t;
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
