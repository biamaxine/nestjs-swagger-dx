import { Logger } from '@nestjs/common';
import {
  IsNumberOptions,
  IsStrongPasswordOptions,
  ValidationOptions,
} from 'class-validator';
import { CountryCode } from 'libphonenumber-js/max';

import { SDXValidationModule } from '../modules/validation.module';
import { SDXValidationConfig } from '../types/validation-config';
import {
  SDXValidation,
  SDXValidationMap,
  SDXValidationWithInput,
  SDXValidationWithInputMap,
} from '../types/validation-map';
import { SDX_CLASS_VALIDATOR } from './class-validator-map';

function mergeOptions<K extends SDXValidation>(
  key: K,
  opts?: SDXValidationMap[K],
) {
  const config = SDXValidationModule._getConfig()[key];

  return {
    ...(config && 'options' in config ? config.options : {}),

    ...(opts && 'options' in opts ? opts.options : {}),
  } as SDXValidationMap[K] extends { options?: infer O } ? O : undefined;
}

function mergeValidationOptions<
  K extends SDXValidation | SDXValidationWithInput,
>(key: K, validationOptions: ValidationOptions = {}): ValidationOptions {
  const config = SDXValidationModule._getConfig()[key];

  return {
    ...(config?.validationOptions || {}),

    ...validationOptions,
  };
}

function getConfig<K extends keyof SDXValidationConfig>(
  key: K,
): SDXValidationConfig[K] {
  return SDXValidationModule._getConfig()[key];
}

export const SDX_VALIDATOR = {
  Allow: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Allow(
      mergeValidationOptions('Allow', validationOptions),
    );
  },

  ArrayNotEmpty: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ArrayNotEmpty(
      mergeValidationOptions('ArrayNotEmpty', validationOptions),
    );
  },

  ArrayUnique: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ArrayUnique(
      mergeValidationOptions('ArrayUnique', validationOptions),
    );
  },

  IsDefined: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsDefined(
      mergeValidationOptions('IsDefined', validationOptions),
    );
  },

  IsOptional: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsOptional(
      mergeValidationOptions('IsOptional', validationOptions),
    );
  },

  IsLatLong: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsLatLong(
      mergeValidationOptions('IsLatLong', validationOptions),
    );
  },

  IsLatitude: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsLatitude(
      mergeValidationOptions('IsLatitude', validationOptions),
    );
  },

  IsLongitude: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsLongitude(
      mergeValidationOptions('IsLongitude', validationOptions),
    );
  },

  IsEmpty: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsEmpty(
      mergeValidationOptions('IsEmpty', validationOptions),
    );
  },

  IsNotEmpty: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsNotEmpty(
      mergeValidationOptions('IsNotEmpty', validationOptions),
    );
  },

  IsPositive: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsPositive(
      mergeValidationOptions('IsPositive', validationOptions),
    );
  },

  IsNegative: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsNegative(
      mergeValidationOptions('IsNegative', validationOptions),
    );
  },

  IsAlpha: function (
    validationOptions?: ValidationOptions,
    locale?: validator.AlphaLocale,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsAlpha(
      locale ?? getConfig('IsAlpha')?.locale,
      mergeValidationOptions('IsAlpha', validationOptions),
    );
  },

  IsAlphanumeric: function (
    validationOptions?: ValidationOptions,
    locale?: validator.AlphanumericLocale,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsAlphanumeric(
      locale ?? getConfig('IsAlphanumeric')?.locale,
      mergeValidationOptions('IsAlphanumeric', validationOptions),
    );
  },

  IsDecimal: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsDecimalOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsDecimal(
      mergeOptions('IsDecimal', { options }),
      mergeValidationOptions('IsDecimal', validationOptions),
    );
  },

  IsAscii: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsAscii(
      mergeValidationOptions('IsAscii', validationOptions),
    );
  },

  IsBase64: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsBase64Options,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsBase64(
      mergeOptions('IsBase64', { options }),
      mergeValidationOptions('IsBase64', validationOptions),
    );
  },

  IsCreditCard: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsCreditCard(
      mergeValidationOptions('IsCreditCard', validationOptions),
    );
  },

  IsCurrency: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsCurrencyOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsCurrency(
      mergeOptions('IsCurrency', { options }),
      mergeValidationOptions('IsCurrency', validationOptions),
    );
  },

  IsEmail: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsEmailOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsEmail(
      mergeOptions('IsEmail', { options }),
      mergeValidationOptions('IsEmail', validationOptions),
    );
  },

  IsFQDN: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsFQDNOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsFQDN(
      mergeOptions('IsFQDN', { options }),
      mergeValidationOptions('IsFQDN', validationOptions),
    );
  },

  IsFullWidth: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsFullWidth(
      mergeValidationOptions('IsFullWidth', validationOptions),
    );
  },

  IsHalfWidth: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsHalfWidth(
      mergeValidationOptions('IsHalfWidth', validationOptions),
    );
  },

  IsVariableWidth: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsVariableWidth(
      mergeValidationOptions('IsVariableWidth', validationOptions),
    );
  },

  IsHexColor: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsHexColor(
      mergeValidationOptions('IsHexColor', validationOptions),
    );
  },

  IsHexadecimal: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsHexadecimal(
      mergeValidationOptions('IsHexadecimal', validationOptions),
    );
  },

  IsMACAddress: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsMACAddressOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsMACAddress(
      mergeOptions('IsMACAddress', { options }),
      mergeValidationOptions('IsMACAddress', validationOptions),
    );
  },

  IsIP: function (
    validationOptions?: ValidationOptions,
    version?: validator.IPVersion,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsIP(
      version ?? getConfig('IsIP')?.version,
      mergeValidationOptions('IsIP', validationOptions),
    );
  },

  IsPort: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsPort(
      mergeValidationOptions('IsPort', validationOptions),
    );
  },

  IsISBN: function (
    validationOptions?: ValidationOptions,
    version?: validator.ISBNVersion,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISBN(
      version ?? getConfig('IsISBN')?.version,
      mergeValidationOptions('IsISBN', validationOptions),
    );
  },

  IsISIN: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISIN(
      mergeValidationOptions('IsISIN', validationOptions),
    );
  },

  IsISO8601: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsISO8601Options,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISO8601(
      mergeOptions('IsISO8601', { options }),
      mergeValidationOptions('IsISO8601', validationOptions),
    );
  },

  IsJSON: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsJSON(
      mergeValidationOptions('IsJSON', validationOptions),
    );
  },

  IsJWT: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsJWT(
      mergeValidationOptions('IsJWT', validationOptions),
    );
  },

  IsLowercase: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsLowercase(
      mergeValidationOptions('IsLowercase', validationOptions),
    );
  },

  IsMobilePhone: function (
    validationOptions?: ValidationOptions,
    locale?: validator.MobilePhoneLocale,
    options?: validator.IsMobilePhoneOptions,
  ): PropertyDecorator {
    const config = getConfig('IsMobilePhone');
    return SDX_CLASS_VALIDATOR.IsMobilePhone(
      locale ?? config?.locale,
      mergeOptions('IsMobilePhone', { options }),
      mergeValidationOptions('IsMobilePhone', validationOptions),
    );
  },

  IsISO31661Alpha2: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISO31661Alpha2(
      mergeValidationOptions('IsISO31661Alpha2', validationOptions),
    );
  },

  IsISO31661Alpha3: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISO31661Alpha3(
      mergeValidationOptions('IsISO31661Alpha3', validationOptions),
    );
  },

  IsMongoId: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsMongoId(
      mergeValidationOptions('IsMongoId', validationOptions),
    );
  },

  IsMultibyte: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsMultibyte(
      mergeValidationOptions('IsMultibyte', validationOptions),
    );
  },

  IsSurrogatePair: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsSurrogatePair(
      mergeValidationOptions('IsSurrogatePair', validationOptions),
    );
  },

  IsUrl: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsURLOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsUrl(
      mergeOptions('IsUrl', { options }),
      mergeValidationOptions('IsUrl', validationOptions),
    );
  },

  IsUUID: function (
    validationOptions?: ValidationOptions,
    version?: validator.UUIDVersion,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsUUID(
      version ?? getConfig('IsUUID')?.version,
      mergeValidationOptions('IsUUID', validationOptions),
    );
  },

  IsFirebasePushId: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsFirebasePushId(
      mergeValidationOptions('IsFirebasePushId', validationOptions),
    );
  },

  IsUppercase: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsUppercase(
      mergeValidationOptions('IsUppercase', validationOptions),
    );
  },

  IsPhoneNumber: function (
    validationOptions?: ValidationOptions,
    region?: CountryCode,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsPhoneNumber(
      region ?? getConfig('IsPhoneNumber')?.region,
      mergeValidationOptions('IsPhoneNumber', validationOptions),
    );
  },

  IsMilitaryTime: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsMilitaryTime(
      mergeValidationOptions('IsMilitaryTime', validationOptions),
    );
  },

  IsHash: function (
    validationOptions?: ValidationOptions,
    algorithm?: string,
  ): PropertyDecorator {
    const _algorithm = algorithm ?? getConfig('IsHash')?.algorithm;

    if (!_algorithm)
      Logger.warn('IsHash was called without an algorithm. Using SHA256.');

    return SDX_CLASS_VALIDATOR.IsHash(
      _algorithm ?? 'SHA256',
      mergeValidationOptions('IsHash', validationOptions),
    );
  },

  IsISSN: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsISSNOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISSN(
      mergeOptions('IsISSN', { options }),
      mergeValidationOptions('IsISSN', validationOptions),
    );
  },

  IsDateString: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsISO8601Options,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsDateString(
      mergeOptions('IsDateString', { options }),
      mergeValidationOptions('IsDateString', validationOptions),
    );
  },

  IsBooleanString: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsBooleanString(
      mergeValidationOptions('IsBooleanString', validationOptions),
    );
  },

  IsNumberString: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsNumericOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsNumberString(
      mergeOptions('IsNumberString', { options }),
      mergeValidationOptions('IsNumberString', validationOptions),
    );
  },

  IsBase32: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsBase32(
      mergeValidationOptions('IsBase32', validationOptions),
    );
  },

  IsBIC: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsBIC(
      mergeValidationOptions('IsBIC', validationOptions),
    );
  },

  IsBtcAddress: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsBtcAddress(
      mergeValidationOptions('IsBtcAddress', validationOptions),
    );
  },

  IsDataURI: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsDataURI(
      mergeValidationOptions('IsDataURI', validationOptions),
    );
  },

  IsEAN: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsEAN(
      mergeValidationOptions('IsEAN', validationOptions),
    );
  },

  IsEthereumAddress: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsEthereumAddress(
      mergeValidationOptions('IsEthereumAddress', validationOptions),
    );
  },

  IsHSL: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsHSL(
      mergeValidationOptions('IsHSL', validationOptions),
    );
  },

  IsIBAN: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsIBAN(
      mergeValidationOptions('IsIBAN', validationOptions),
    );
  },

  IsIdentityCard: function (
    validationOptions?: ValidationOptions,
    locale?: validator.IdentityCardLocale,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsIdentityCard(
      locale ?? getConfig('IsIdentityCard')?.locale,
      mergeValidationOptions('IsIdentityCard', validationOptions),
    );
  },

  IsISRC: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISRC(
      mergeValidationOptions('IsISRC', validationOptions),
    );
  },

  IsLocale: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsLocale(
      mergeValidationOptions('IsLocale', validationOptions),
    );
  },

  IsMagnetURI: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsMagnetURI(
      mergeValidationOptions('IsMagnetURI', validationOptions),
    );
  },

  IsMimeType: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsMimeType(
      mergeValidationOptions('IsMimeType', validationOptions),
    );
  },

  IsOctal: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsOctal(
      mergeValidationOptions('IsOctal', validationOptions),
    );
  },

  IsPassportNumber: function (
    validationOptions?: ValidationOptions,
    countryCode?: CountryCode,
  ): PropertyDecorator {
    const _countryCode =
      countryCode ?? getConfig('IsPassportNumber')?.countryCode;

    if (!_countryCode)
      Logger.warn(
        'IsPassportNumber was called without a countryCode. Using "US"',
      );

    return SDX_CLASS_VALIDATOR.IsPassportNumber(
      _countryCode ?? 'US',
      mergeValidationOptions('IsPassportNumber', validationOptions),
    );
  },

  IsPostalCode: function (
    validationOptions?: ValidationOptions,
    locale?: 'any' | validator.PostalCodeLocale,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsPostalCode(
      locale ?? getConfig('IsPostalCode')?.locale,
      mergeValidationOptions('IsPostalCode', validationOptions),
    );
  },

  IsRFC3339: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsRFC3339(
      mergeValidationOptions('IsRFC3339', validationOptions),
    );
  },

  IsRgbColor: function (
    validationOptions?: ValidationOptions,
    includePercentValues?: boolean,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsRgbColor(
      includePercentValues ?? getConfig('IsRgbColor')?.includePercentValues,
      mergeValidationOptions('IsRgbColor', validationOptions),
    );
  },

  IsSemVer: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsSemVer(
      mergeValidationOptions('IsSemVer', validationOptions),
    );
  },

  IsStrongPassword: function (
    validationOptions?: ValidationOptions,
    options?: IsStrongPasswordOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsStrongPassword(
      mergeOptions('IsStrongPassword', { options }),
      mergeValidationOptions('IsStrongPassword', validationOptions),
    );
  },

  IsTimeZone: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsTimeZone(
      mergeValidationOptions('IsTimeZone', validationOptions),
    );
  },

  IsBase58: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsBase58(
      mergeValidationOptions('IsBase58', validationOptions),
    );
  },

  IsTaxId: function (
    validationOptions?: ValidationOptions,
    locale?: string,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsTaxId(
      locale ?? getConfig('IsTaxId')?.locale,
      mergeValidationOptions('IsTaxId', validationOptions),
    );
  },

  IsISO4217CurrencyCode: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISO4217CurrencyCode(
      mergeValidationOptions('IsISO4217CurrencyCode', validationOptions),
    );
  },

  IsBoolean: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsBoolean(
      mergeValidationOptions('IsBoolean', validationOptions),
    );
  },

  IsDate: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsDate(
      mergeValidationOptions('IsDate', validationOptions),
    );
  },

  IsNumber: function (
    validationOptions?: ValidationOptions,
    options?: IsNumberOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsNumber(
      mergeOptions('IsNumber', { options }),
      mergeValidationOptions('IsNumber', validationOptions),
    );
  },

  IsInt: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsInt(
      mergeValidationOptions('IsInt', validationOptions),
    );
  },

  IsString: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsString(
      mergeValidationOptions('IsString', validationOptions),
    );
  },

  IsArray: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsArray(
      mergeValidationOptions('IsArray', validationOptions),
    );
  },

  IsObject: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsObject(
      mergeValidationOptions('IsObject', validationOptions),
    );
  },

  IsNotEmptyObject: function (
    validationOptions?: ValidationOptions,
    options?: { nullable?: boolean },
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsNotEmptyObject(
      mergeOptions('IsNotEmptyObject', { options }),
      mergeValidationOptions('IsNotEmptyObject', validationOptions),
    );
  },

  ValidateNested: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ValidateNested(
      mergeValidationOptions('ValidateNested', validationOptions),
    );
  },

  ValidatePromise: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ValidatePromise(
      mergeValidationOptions('ValidatePromise', validationOptions),
    );
  },
} as const;

export const SDX_VALIDATOR_WITH_INPUT = {
  ArrayContains: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['ArrayContains']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ArrayContains(
      ...inputs,
      mergeValidationOptions('ArrayContains', validationOptions),
    );
  },

  ArrayNotContains: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['ArrayNotContains']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ArrayNotContains(
      ...inputs,
      mergeValidationOptions('ArrayNotContains', validationOptions),
    );
  },

  ArrayMinSize: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['ArrayMinSize']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ArrayMinSize(
      ...inputs,
      mergeValidationOptions('ArrayMinSize', validationOptions),
    );
  },

  ArrayMaxSize: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['ArrayMaxSize']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ArrayMaxSize(
      ...inputs,
      mergeValidationOptions('ArrayMaxSize', validationOptions),
    );
  },

  Contains: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['Contains']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Contains(
      ...inputs,
      mergeValidationOptions('Contains', validationOptions),
    );
  },

  Equals: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['Equals']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Equals(
      ...inputs,
      mergeValidationOptions('Equals', validationOptions),
    );
  },

  IsIn: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['IsIn']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsIn(
      ...inputs,
      mergeValidationOptions('IsIn', validationOptions),
    );
  },

  IsNotIn: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['IsNotIn']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsNotIn(
      ...inputs,
      mergeValidationOptions('IsNotIn', validationOptions),
    );
  },

  IsDivisibleBy: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['IsDivisibleBy']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsDivisibleBy(
      ...inputs,
      mergeValidationOptions('IsDivisibleBy', validationOptions),
    );
  },

  IsByteLength: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['IsByteLength']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsByteLength(
      ...inputs,
      mergeValidationOptions('IsByteLength', validationOptions),
    );
  },

  IsEnum: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['IsEnum']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsEnum(
      ...inputs,
      mergeValidationOptions('IsEnum', validationOptions),
    );
  },

  IsInstance: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['IsInstance']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsInstance(
      ...inputs,
      mergeValidationOptions('IsInstance', validationOptions),
    );
  },

  Length: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['Length']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Length(
      ...inputs,
      mergeValidationOptions('Length', validationOptions),
    );
  },

  Matches: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['Matches']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Matches(
      ...inputs,
      mergeValidationOptions('Matches', validationOptions),
    );
  },

  Max: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['Max']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Max(
      ...inputs,
      mergeValidationOptions('Max', validationOptions),
    );
  },

  Min: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['Min']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Min(
      ...inputs,
      mergeValidationOptions('Min', validationOptions),
    );
  },

  MinDate: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['MinDate']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.MinDate(
      ...inputs,
      mergeValidationOptions('MinDate', validationOptions),
    );
  },

  MaxDate: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['MaxDate']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.MaxDate(
      ...inputs,
      mergeValidationOptions('MaxDate', validationOptions),
    );
  },

  MaxLength: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['MaxLength']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.MaxLength(
      ...inputs,
      mergeValidationOptions('MaxLength', validationOptions),
    );
  },

  MinLength: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['MinLength']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.MinLength(
      ...inputs,
      mergeValidationOptions('MinLength', validationOptions),
    );
  },

  NotContains: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['NotContains']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.NotContains(
      ...inputs,
      mergeValidationOptions('NotContains', validationOptions),
    );
  },

  NotEquals: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['NotEquals']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.NotEquals(
      ...inputs,
      mergeValidationOptions('NotEquals', validationOptions),
    );
  },

  Validate: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['Validate']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Validate(
      ...inputs,
      mergeValidationOptions('Validate', validationOptions),
    );
  },

  ValidateBy: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['ValidateBy']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ValidateBy(
      ...inputs,
      mergeValidationOptions('ValidateBy', validationOptions),
    );
  },

  ValidateIf: function (
    validationOptions: ValidationOptions = {},
    ...inputs: SDXValidationWithInputMap['ValidateIf']
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ValidateIf(
      ...inputs,
      mergeValidationOptions('ValidateIf', validationOptions),
    );
  },
} as const;

export type PropertyDecoratorFnWithInputs = (
  validationOptions: ValidationOptions,
  ...args: unknown[]
) => PropertyDecorator;
