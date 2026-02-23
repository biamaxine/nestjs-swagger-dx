import { Logger } from '@nestjs/common';
import {
  IsNumberOptions,
  IsStrongPasswordOptions,
  ValidationOptions,
} from 'class-validator';
import { CountryCode } from 'libphonenumber-js/max';

import {
  PropertyDecoratorFn,
  SDX_CLASS_VALIDATOR,
} from './class-validator-map';
import { SDXValidationModule } from '../modules/validation.module';
import { SDXValidationConfig } from '../types/validation-config';
import {
  SDXValidation,
  SDXValidationMap,
  SDXValidationWithInput,
  SDXValidationWithInputMap,
} from '../types/validation-map';

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
  } as PropertyDecoratorFn,

  ArrayNotEmpty: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ArrayNotEmpty(
      mergeValidationOptions('ArrayNotEmpty', validationOptions),
    );
  } as PropertyDecoratorFn,

  ArrayUnique: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ArrayUnique(
      mergeValidationOptions('ArrayUnique', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsDefined: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsDefined(
      mergeValidationOptions('IsDefined', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsOptional: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsOptional(
      mergeValidationOptions('IsOptional', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsLatLong: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsLatLong(
      mergeValidationOptions('IsLatLong', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsLatitude: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsLatitude(
      mergeValidationOptions('IsLatitude', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsLongitude: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsLongitude(
      mergeValidationOptions('IsLongitude', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsEmpty: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsEmpty(
      mergeValidationOptions('IsEmpty', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsNotEmpty: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsNotEmpty(
      mergeValidationOptions('IsNotEmpty', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsPositive: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsPositive(
      mergeValidationOptions('IsPositive', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsNegative: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsNegative(
      mergeValidationOptions('IsNegative', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsAlpha: function (
    validationOptions?: ValidationOptions,
    locale?: validator.AlphaLocale,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsAlpha(
      locale ?? getConfig('IsAlpha')?.locale,
      mergeValidationOptions('IsAlpha', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsAlphanumeric: function (
    validationOptions?: ValidationOptions,
    locale?: validator.AlphanumericLocale,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsAlphanumeric(
      locale ?? getConfig('IsAlphanumeric')?.locale,
      mergeValidationOptions('IsAlphanumeric', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsDecimal: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsDecimalOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsDecimal(
      mergeOptions('IsDecimal', { options }),
      mergeValidationOptions('IsDecimal', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsAscii: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsAscii(
      mergeValidationOptions('IsAscii', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsBase64: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsBase64Options,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsBase64(
      mergeOptions('IsBase64', { options }),
      mergeValidationOptions('IsBase64', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsCreditCard: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsCreditCard(
      mergeValidationOptions('IsCreditCard', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsCurrency: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsCurrencyOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsCurrency(
      mergeOptions('IsCurrency', { options }),
      mergeValidationOptions('IsCurrency', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsEmail: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsEmailOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsEmail(
      mergeOptions('IsEmail', { options }),
      mergeValidationOptions('IsEmail', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsFQDN: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsFQDNOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsFQDN(
      mergeOptions('IsFQDN', { options }),
      mergeValidationOptions('IsFQDN', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsFullWidth: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsFullWidth(
      mergeValidationOptions('IsFullWidth', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsHalfWidth: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsHalfWidth(
      mergeValidationOptions('IsHalfWidth', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsVariableWidth: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsVariableWidth(
      mergeValidationOptions('IsVariableWidth', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsHexColor: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsHexColor(
      mergeValidationOptions('IsHexColor', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsHexadecimal: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsHexadecimal(
      mergeValidationOptions('IsHexadecimal', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsMACAddress: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsMACAddressOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsMACAddress(
      mergeOptions('IsMACAddress', { options }),
      mergeValidationOptions('IsMACAddress', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsIP: function (
    validationOptions?: ValidationOptions,
    version?: validator.IPVersion,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsIP(
      version ?? getConfig('IsIP')?.version,
      mergeValidationOptions('IsIP', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsPort: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsPort(
      mergeValidationOptions('IsPort', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsISBN: function (
    validationOptions?: ValidationOptions,
    version?: validator.ISBNVersion,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISBN(
      version ?? getConfig('IsISBN')?.version,
      mergeValidationOptions('IsISBN', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsISIN: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISIN(
      mergeValidationOptions('IsISIN', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsISO8601: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsISO8601Options,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISO8601(
      mergeOptions('IsISO8601', { options }),
      mergeValidationOptions('IsISO8601', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsJSON: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsJSON(
      mergeValidationOptions('IsJSON', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsJWT: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsJWT(
      mergeValidationOptions('IsJWT', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsLowercase: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsLowercase(
      mergeValidationOptions('IsLowercase', validationOptions),
    );
  } as PropertyDecoratorFn,

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
  } as PropertyDecoratorFn,

  IsISO31661Alpha2: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISO31661Alpha2(
      mergeValidationOptions('IsISO31661Alpha2', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsISO31661Alpha3: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISO31661Alpha3(
      mergeValidationOptions('IsISO31661Alpha3', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsMongoId: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsMongoId(
      mergeValidationOptions('IsMongoId', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsMultibyte: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsMultibyte(
      mergeValidationOptions('IsMultibyte', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsSurrogatePair: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsSurrogatePair(
      mergeValidationOptions('IsSurrogatePair', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsUrl: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsURLOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsUrl(
      mergeOptions('IsUrl', { options }),
      mergeValidationOptions('IsUrl', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsUUID: function (
    validationOptions?: ValidationOptions,
    version?: validator.UUIDVersion,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsUUID(
      version ?? getConfig('IsUUID')?.version,
      mergeValidationOptions('IsUUID', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsFirebasePushId: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsFirebasePushId(
      mergeValidationOptions('IsFirebasePushId', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsUppercase: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsUppercase(
      mergeValidationOptions('IsUppercase', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsPhoneNumber: function (
    validationOptions?: ValidationOptions,
    region?: CountryCode,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsPhoneNumber(
      region ?? getConfig('IsPhoneNumber')?.region,
      mergeValidationOptions('IsPhoneNumber', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsMilitaryTime: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsMilitaryTime(
      mergeValidationOptions('IsMilitaryTime', validationOptions),
    );
  } as PropertyDecoratorFn,

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
  } as PropertyDecoratorFn,

  IsISSN: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsISSNOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISSN(
      mergeOptions('IsISSN', { options }),
      mergeValidationOptions('IsISSN', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsDateString: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsISO8601Options,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsDateString(
      mergeOptions('IsDateString', { options }),
      mergeValidationOptions('IsDateString', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsBooleanString: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsBooleanString(
      mergeValidationOptions('IsBooleanString', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsNumberString: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsNumericOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsNumberString(
      mergeOptions('IsNumberString', { options }),
      mergeValidationOptions('IsNumberString', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsBase32: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsBase32(
      mergeValidationOptions('IsBase32', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsBIC: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsBIC(
      mergeValidationOptions('IsBIC', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsBtcAddress: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsBtcAddress(
      mergeValidationOptions('IsBtcAddress', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsDataURI: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsDataURI(
      mergeValidationOptions('IsDataURI', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsEAN: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsEAN(
      mergeValidationOptions('IsEAN', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsEthereumAddress: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsEthereumAddress(
      mergeValidationOptions('IsEthereumAddress', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsHSL: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsHSL(
      mergeValidationOptions('IsHSL', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsIBAN: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsIBAN(
      mergeValidationOptions('IsIBAN', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsIdentityCard: function (
    validationOptions?: ValidationOptions,
    locale?: validator.IdentityCardLocale,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsIdentityCard(
      locale ?? getConfig('IsIdentityCard')?.locale,
      mergeValidationOptions('IsIdentityCard', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsISRC: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISRC(
      mergeValidationOptions('IsISRC', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsLocale: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsLocale(
      mergeValidationOptions('IsLocale', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsMagnetURI: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsMagnetURI(
      mergeValidationOptions('IsMagnetURI', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsMimeType: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsMimeType(
      mergeValidationOptions('IsMimeType', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsOctal: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsOctal(
      mergeValidationOptions('IsOctal', validationOptions),
    );
  } as PropertyDecoratorFn,

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
  } as PropertyDecoratorFn,

  IsPostalCode: function (
    validationOptions?: ValidationOptions,
    locale?: 'any' | validator.PostalCodeLocale,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsPostalCode(
      locale ?? getConfig('IsPostalCode')?.locale,
      mergeValidationOptions('IsPostalCode', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsRFC3339: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsRFC3339(
      mergeValidationOptions('IsRFC3339', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsRgbColor: function (
    validationOptions?: ValidationOptions,
    includePercentValues?: boolean,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsRgbColor(
      includePercentValues ?? getConfig('IsRgbColor')?.includePercentValues,
      mergeValidationOptions('IsRgbColor', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsSemVer: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsSemVer(
      mergeValidationOptions('IsSemVer', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsStrongPassword: function (
    validationOptions?: ValidationOptions,
    options?: IsStrongPasswordOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsStrongPassword(
      mergeOptions('IsStrongPassword', { options }),
      mergeValidationOptions('IsStrongPassword', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsTimeZone: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsTimeZone(
      mergeValidationOptions('IsTimeZone', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsBase58: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsBase58(
      mergeValidationOptions('IsBase58', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsTaxId: function (
    validationOptions?: ValidationOptions,
    locale?: string,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsTaxId(
      locale ?? getConfig('IsTaxId')?.locale,
      mergeValidationOptions('IsTaxId', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsISO4217CurrencyCode: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsISO4217CurrencyCode(
      mergeValidationOptions('IsISO4217CurrencyCode', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsBoolean: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsBoolean(
      mergeValidationOptions('IsBoolean', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsDate: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsDate(
      mergeValidationOptions('IsDate', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsNumber: function (
    validationOptions?: ValidationOptions,
    options?: IsNumberOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsNumber(
      mergeOptions('IsNumber', { options }),
      mergeValidationOptions('IsNumber', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsInt: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsInt(
      mergeValidationOptions('IsInt', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsString: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsString(
      mergeValidationOptions('IsString', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsArray: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsArray(
      mergeValidationOptions('IsArray', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsObject: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsObject(
      mergeValidationOptions('IsObject', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsNotEmptyObject: function (
    validationOptions?: ValidationOptions,
    options?: { nullable?: boolean },
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsNotEmptyObject(
      mergeOptions('IsNotEmptyObject', { options }),
      mergeValidationOptions('IsNotEmptyObject', validationOptions),
    );
  } as PropertyDecoratorFn,

  ValidateNested: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ValidateNested(
      mergeValidationOptions('ValidateNested', validationOptions),
    );
  } as PropertyDecoratorFn,

  ValidatePromise: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ValidatePromise(
      mergeValidationOptions('ValidatePromise', validationOptions),
    );
  } as PropertyDecoratorFn,
} as const;

export const SDX_VALIDATOR_WITH_INPUT = {
  ArrayContains: function (
    inputs: SDXValidationWithInputMap['ArrayContains'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ArrayContains(
      ...inputs,
      mergeValidationOptions('ArrayContains', validationOptions),
    );
  } as PropertyDecoratorFn,

  ArrayNotContains: function (
    inputs: SDXValidationWithInputMap['ArrayNotContains'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ArrayNotContains(
      ...inputs,
      mergeValidationOptions('ArrayNotContains', validationOptions),
    );
  } as PropertyDecoratorFn,

  ArrayMinSize: function (
    inputs: SDXValidationWithInputMap['ArrayMinSize'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ArrayMinSize(
      ...inputs,
      mergeValidationOptions('ArrayMinSize', validationOptions),
    );
  } as PropertyDecoratorFn,

  ArrayMaxSize: function (
    inputs: SDXValidationWithInputMap['ArrayMaxSize'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ArrayMaxSize(
      ...inputs,
      mergeValidationOptions('ArrayMaxSize', validationOptions),
    );
  } as PropertyDecoratorFn,

  Contains: function (
    inputs: SDXValidationWithInputMap['Contains'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Contains(
      ...inputs,
      mergeValidationOptions('Contains', validationOptions),
    );
  } as PropertyDecoratorFn,

  Equals: function (
    inputs: SDXValidationWithInputMap['Equals'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Equals(
      ...inputs,
      mergeValidationOptions('Equals', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsIn: function (
    inputs: SDXValidationWithInputMap['IsIn'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsIn(
      ...inputs,
      mergeValidationOptions('IsIn', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsNotIn: function (
    inputs: SDXValidationWithInputMap['IsNotIn'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsNotIn(
      ...inputs,
      mergeValidationOptions('IsNotIn', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsDivisibleBy: function (
    inputs: SDXValidationWithInputMap['IsDivisibleBy'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsDivisibleBy(
      ...inputs,
      mergeValidationOptions('IsDivisibleBy', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsByteLength: function (
    inputs: SDXValidationWithInputMap['IsByteLength'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsByteLength(
      ...inputs,
      mergeValidationOptions('IsByteLength', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsEnum: function (
    inputs: SDXValidationWithInputMap['IsEnum'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsEnum(
      ...inputs,
      mergeValidationOptions('IsEnum', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsInstance: function (
    inputs: SDXValidationWithInputMap['IsInstance'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.IsInstance(
      ...inputs,
      mergeValidationOptions('IsInstance', validationOptions),
    );
  } as PropertyDecoratorFn,

  Length: function (
    inputs: SDXValidationWithInputMap['Length'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Length(
      ...inputs,
      mergeValidationOptions('Length', validationOptions),
    );
  } as PropertyDecoratorFn,

  Matches: function (
    inputs: SDXValidationWithInputMap['Matches'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Matches(
      ...inputs,
      mergeValidationOptions('Matches', validationOptions),
    );
  } as PropertyDecoratorFn,

  Max: function (
    inputs: SDXValidationWithInputMap['Max'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Max(
      ...inputs,
      mergeValidationOptions('Max', validationOptions),
    );
  } as PropertyDecoratorFn,

  Min: function (
    inputs: SDXValidationWithInputMap['Min'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Min(
      ...inputs,
      mergeValidationOptions('Min', validationOptions),
    );
  } as PropertyDecoratorFn,

  MinDate: function (
    inputs: SDXValidationWithInputMap['MinDate'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.MinDate(
      ...inputs,
      mergeValidationOptions('MinDate', validationOptions),
    );
  } as PropertyDecoratorFn,

  MaxDate: function (
    inputs: SDXValidationWithInputMap['MaxDate'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.MaxDate(
      ...inputs,
      mergeValidationOptions('MaxDate', validationOptions),
    );
  } as PropertyDecoratorFn,

  MaxLength: function (
    inputs: SDXValidationWithInputMap['MaxLength'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.MaxLength(
      ...inputs,
      mergeValidationOptions('MaxLength', validationOptions),
    );
  } as PropertyDecoratorFn,

  MinLength: function (
    inputs: SDXValidationWithInputMap['MinLength'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.MinLength(
      ...inputs,
      mergeValidationOptions('MinLength', validationOptions),
    );
  } as PropertyDecoratorFn,

  NotContains: function (
    inputs: SDXValidationWithInputMap['NotContains'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.NotContains(
      ...inputs,
      mergeValidationOptions('NotContains', validationOptions),
    );
  } as PropertyDecoratorFn,

  NotEquals: function (
    inputs: SDXValidationWithInputMap['NotEquals'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.NotEquals(
      ...inputs,
      mergeValidationOptions('NotEquals', validationOptions),
    );
  } as PropertyDecoratorFn,

  Validate: function (
    inputs: SDXValidationWithInputMap['Validate'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.Validate(
      ...inputs,
      mergeValidationOptions('Validate', validationOptions),
    );
  } as PropertyDecoratorFn,

  ValidateBy: function (
    inputs: SDXValidationWithInputMap['ValidateBy'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ValidateBy(
      ...inputs,
      mergeValidationOptions('ValidateBy', validationOptions),
    );
  } as PropertyDecoratorFn,

  ValidateIf: function (
    inputs: SDXValidationWithInputMap['ValidateIf'],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDX_CLASS_VALIDATOR.ValidateIf(
      ...inputs,
      mergeValidationOptions('ValidateIf', validationOptions),
    );
  } as PropertyDecoratorFn,
} as const;
