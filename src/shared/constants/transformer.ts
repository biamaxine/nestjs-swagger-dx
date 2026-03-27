import { Transform, TransformOptions } from 'class-transformer';

const NORMALIZE_REGEX = /\s+/g;
const CLEAR_SYMBOLS = /\D/g;

export const SDX_TRANSFORMER = {
  ToUppercase: <T>(transformOptions?: TransformOptions) =>
    Transform(
      ({ value }: { value: T }): T | string =>
        typeof value === 'string' ? value.toUpperCase() : value,
      transformOptions,
    ),

  ToLowercase: <T>(transformOptions?: TransformOptions) =>
    Transform(
      ({ value }: { value: T }): T | string =>
        typeof value === 'string' ? value.toLowerCase() : value,
      transformOptions,
    ),

  ToNormalized: <T>(transformOptions?: TransformOptions) =>
    Transform(
      ({ value }: { value: T }): T | string =>
        typeof value === 'string'
          ? value.replace(NORMALIZE_REGEX, ' ').trim()
          : value,
      transformOptions,
    ),

  ToCleanOfSymbols: <T>(transformOptions?: TransformOptions) =>
    Transform(
      ({ value }: { value: T }): T | string =>
        typeof value === 'string' ? value.replace(CLEAR_SYMBOLS, '') : value,
      transformOptions,
    ),

  ToParsedJSON: <T>(transformOptions?: TransformOptions) =>
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    Transform(({ value }: { value: T }): T | unknown => {
      if (typeof value !== 'string') return value;

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }, transformOptions),

  StringTo: <T, U>(
    callback: (value: string) => T,
    transformOptions?: TransformOptions,
  ) =>
    Transform(
      ({ value }: { value: U }): U | T =>
        typeof value === 'string' ? callback(value) : value,
      transformOptions,
    ),

  NumberTo: <T, U>(
    callback: (value: number) => T,
    transformOptions?: TransformOptions,
  ) =>
    Transform(
      ({ value }: { value: U }): U | T =>
        typeof value === 'number' ? callback(value) : value,
      transformOptions,
    ),

  BooleanTo: <T, U>(
    callback: (value: boolean) => T,
    transformOptions?: TransformOptions,
  ) =>
    Transform(
      ({ value }: { value: U }): U | T =>
        typeof value === 'boolean' ? callback(value) : value,
      transformOptions,
    ),

  ObjectTo: <T, U>(
    callback: (value: object) => T,
    transformOptions?: TransformOptions,
  ) =>
    Transform(
      ({ value }: { value: U }): U | T =>
        typeof value === 'object' ? callback(value as object) : value,
      transformOptions,
    ),
} as const;
