import { Logger } from '@nestjs/common';
import {
  IsNumberOptions,
  IsStrongPasswordOptions,
  ValidationOptions,
} from 'class-validator';
import { CountryCode } from 'libphonenumber-js/max';

import { SDXValidation, SDXValidationMap } from '../types/validation-map';
import { SDXValidationConfig } from '../types/validation-config';
import { SDXValidationModule } from '../modules/validation.module';
import {
  PropertyDecoratorFn,
  SDXClassValidatorMap,
} from './class-validator-map';

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

function mergeValidationOptions<K extends keyof SDXValidationMap>(
  key: K,
  validationOptions: ValidationOptions = {},
): ValidationOptions {
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

export const SDXValidator: Record<SDXValidation, PropertyDecoratorFn> = {
  Allow: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.Allow(
      mergeValidationOptions('Allow', validationOptions),
    );
  } as PropertyDecoratorFn,

  ArrayNotEmpty: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.ArrayNotEmpty(
      mergeValidationOptions('ArrayNotEmpty', validationOptions),
    );
  } as PropertyDecoratorFn,

  ArrayUnique: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.ArrayUnique(
      mergeValidationOptions('ArrayUnique', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsDefined: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsDefined(
      mergeValidationOptions('IsDefined', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsOptional: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsOptional(
      mergeValidationOptions('IsOptional', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsLatLong: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsLatLong(
      mergeValidationOptions('IsLatLong', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsLatitude: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsLatitude(
      mergeValidationOptions('IsLatitude', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsLongitude: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsLongitude(
      mergeValidationOptions('IsLongitude', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsEmpty: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsEmpty(
      mergeValidationOptions('IsEmpty', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsNotEmpty: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsNotEmpty(
      mergeValidationOptions('IsNotEmpty', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsPositive: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsPositive(
      mergeValidationOptions('IsPositive', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsNegative: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsNegative(
      mergeValidationOptions('IsNegative', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsAlpha: function (
    validationOptions?: ValidationOptions,
    locale?: validator.AlphaLocale,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsAlpha(
      locale ?? getConfig('IsAlpha')?.locale,
      mergeValidationOptions('IsAlpha', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsAlphanumeric: function (
    validationOptions?: ValidationOptions,
    locale?: validator.AlphanumericLocale,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsAlphanumeric(
      locale ?? getConfig('IsAlphanumeric')?.locale,
      mergeValidationOptions('IsAlphanumeric', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsDecimal: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsDecimalOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsDecimal(
      mergeOptions('IsDecimal', { options }),
      mergeValidationOptions('IsDecimal', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsAscii: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsAscii(
      mergeValidationOptions('IsAscii', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsBase64: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsBase64Options,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsBase64(
      mergeOptions('IsBase64', { options }),
      mergeValidationOptions('IsBase64', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsCreditCard: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsCreditCard(
      mergeValidationOptions('IsCreditCard', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsCurrency: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsCurrencyOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsCurrency(
      mergeOptions('IsCurrency', { options }),
      mergeValidationOptions('IsCurrency', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsEmail: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsEmailOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsEmail(
      mergeOptions('IsEmail', { options }),
      mergeValidationOptions('IsEmail', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsFQDN: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsFQDNOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsFQDN(
      mergeOptions('IsFQDN', { options }),
      mergeValidationOptions('IsFQDN', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsFullWidth: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsFullWidth(
      mergeValidationOptions('IsFullWidth', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsHalfWidth: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsHalfWidth(
      mergeValidationOptions('IsHalfWidth', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsVariableWidth: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsVariableWidth(
      mergeValidationOptions('IsVariableWidth', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsHexColor: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsHexColor(
      mergeValidationOptions('IsHexColor', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsHexadecimal: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsHexadecimal(
      mergeValidationOptions('IsHexadecimal', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsMACAddress: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsMACAddressOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsMACAddress(
      mergeOptions('IsMACAddress', { options }),
      mergeValidationOptions('IsMACAddress', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsIP: function (
    validationOptions?: ValidationOptions,
    version?: validator.IPVersion,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsIP(
      version ?? getConfig('IsIP')?.version,
      mergeValidationOptions('IsIP', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsPort: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsPort(
      mergeValidationOptions('IsPort', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsISBN: function (
    validationOptions?: ValidationOptions,
    version?: validator.ISBNVersion,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsISBN(
      version ?? getConfig('IsISBN')?.version,
      mergeValidationOptions('IsISBN', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsISIN: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsISIN(
      mergeValidationOptions('IsISIN', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsISO8601: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsISO8601Options,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsISO8601(
      mergeOptions('IsISO8601', { options }),
      mergeValidationOptions('IsISO8601', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsJSON: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsJSON(
      mergeValidationOptions('IsJSON', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsJWT: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsJWT(
      mergeValidationOptions('IsJWT', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsLowercase: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsLowercase(
      mergeValidationOptions('IsLowercase', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsMobilePhone: function (
    validationOptions?: ValidationOptions,
    locale?: validator.MobilePhoneLocale,
    options?: validator.IsMobilePhoneOptions,
  ): PropertyDecorator {
    const config = getConfig('IsMobilePhone');
    return SDXClassValidatorMap.IsMobilePhone(
      locale ?? config?.locale,
      mergeOptions('IsMobilePhone', { options }),
      mergeValidationOptions('IsMobilePhone', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsISO31661Alpha2: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsISO31661Alpha2(
      mergeValidationOptions('IsISO31661Alpha2', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsISO31661Alpha3: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsISO31661Alpha3(
      mergeValidationOptions('IsISO31661Alpha3', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsMongoId: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsMongoId(
      mergeValidationOptions('IsMongoId', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsMultibyte: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsMultibyte(
      mergeValidationOptions('IsMultibyte', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsSurrogatePair: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsSurrogatePair(
      mergeValidationOptions('IsSurrogatePair', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsUrl: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsURLOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsUrl(
      mergeOptions('IsUrl', { options }),
      mergeValidationOptions('IsUrl', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsUUID: function (
    validationOptions?: ValidationOptions,
    version?: validator.UUIDVersion,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsUUID(
      version ?? getConfig('IsUUID')?.version,
      mergeValidationOptions('IsUUID', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsFirebasePushId: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsFirebasePushId(
      mergeValidationOptions('IsFirebasePushId', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsUppercase: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsUppercase(
      mergeValidationOptions('IsUppercase', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsPhoneNumber: function (
    validationOptions?: ValidationOptions,
    region?: CountryCode,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsPhoneNumber(
      region ?? getConfig('IsPhoneNumber')?.region,
      mergeValidationOptions('IsPhoneNumber', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsMilitaryTime: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsMilitaryTime(
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

    return SDXClassValidatorMap.IsHash(
      _algorithm ?? 'SHA256',
      mergeValidationOptions('IsHash', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsISSN: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsISSNOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsISSN(
      mergeOptions('IsISSN', { options }),
      mergeValidationOptions('IsISSN', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsDateString: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsISO8601Options,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsDateString(
      mergeOptions('IsDateString', { options }),
      mergeValidationOptions('IsDateString', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsBooleanString: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsBooleanString(
      mergeValidationOptions('IsBooleanString', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsNumberString: function (
    validationOptions?: ValidationOptions,
    options?: validator.IsNumericOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsNumberString(
      mergeOptions('IsNumberString', { options }),
      mergeValidationOptions('IsNumberString', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsBase32: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsBase32(
      mergeValidationOptions('IsBase32', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsBIC: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsBIC(
      mergeValidationOptions('IsBIC', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsBtcAddress: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsBtcAddress(
      mergeValidationOptions('IsBtcAddress', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsDataURI: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsDataURI(
      mergeValidationOptions('IsDataURI', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsEAN: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsEAN(
      mergeValidationOptions('IsEAN', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsEthereumAddress: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsEthereumAddress(
      mergeValidationOptions('IsEthereumAddress', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsHSL: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsHSL(
      mergeValidationOptions('IsHSL', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsIBAN: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsIBAN(
      mergeValidationOptions('IsIBAN', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsIdentityCard: function (
    validationOptions?: ValidationOptions,
    locale?: validator.IdentityCardLocale,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsIdentityCard(
      locale ?? getConfig('IsIdentityCard')?.locale,
      mergeValidationOptions('IsIdentityCard', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsISRC: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsISRC(
      mergeValidationOptions('IsISRC', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsLocale: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsLocale(
      mergeValidationOptions('IsLocale', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsMagnetURI: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsMagnetURI(
      mergeValidationOptions('IsMagnetURI', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsMimeType: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsMimeType(
      mergeValidationOptions('IsMimeType', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsOctal: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsOctal(
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

    return SDXClassValidatorMap.IsPassportNumber(
      _countryCode ?? 'US',
      mergeValidationOptions('IsPassportNumber', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsPostalCode: function (
    validationOptions?: ValidationOptions,
    locale?: 'any' | validator.PostalCodeLocale,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsPostalCode(
      locale ?? getConfig('IsPostalCode')?.locale,
      mergeValidationOptions('IsPostalCode', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsRFC3339: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsRFC3339(
      mergeValidationOptions('IsRFC3339', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsRgbColor: function (
    validationOptions?: ValidationOptions,
    includePercentValues?: boolean,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsRgbColor(
      includePercentValues ?? getConfig('IsRgbColor')?.includePercentValues,
      mergeValidationOptions('IsRgbColor', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsSemVer: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsSemVer(
      mergeValidationOptions('IsSemVer', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsStrongPassword: function (
    validationOptions?: ValidationOptions,
    options?: IsStrongPasswordOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsStrongPassword(
      mergeOptions('IsStrongPassword', { options }),
      mergeValidationOptions('IsStrongPassword', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsTimeZone: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsTimeZone(
      mergeValidationOptions('IsTimeZone', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsBase58: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsBase58(
      mergeValidationOptions('IsBase58', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsTaxId: function (
    validationOptions?: ValidationOptions,
    locale?: string,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsTaxId(
      locale ?? getConfig('IsTaxId')?.locale,
      mergeValidationOptions('IsTaxId', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsISO4217CurrencyCode: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsISO4217CurrencyCode(
      mergeValidationOptions('IsISO4217CurrencyCode', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsBoolean: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsBoolean(
      mergeValidationOptions('IsBoolean', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsDate: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsDate(
      mergeValidationOptions('IsDate', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsNumber: function (
    validationOptions?: ValidationOptions,
    options?: IsNumberOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsNumber(
      mergeOptions('IsNumber', { options }),
      mergeValidationOptions('IsNumber', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsInt: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsInt(
      mergeValidationOptions('IsInt', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsString: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsString(
      mergeValidationOptions('IsString', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsArray: function (validationOptions?: ValidationOptions): PropertyDecorator {
    return SDXClassValidatorMap.IsArray(
      mergeValidationOptions('IsArray', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsObject: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsObject(
      mergeValidationOptions('IsObject', validationOptions),
    );
  } as PropertyDecoratorFn,

  IsNotEmptyObject: function (
    validationOptions?: ValidationOptions,
    options?: { nullable?: boolean },
  ): PropertyDecorator {
    return SDXClassValidatorMap.IsNotEmptyObject(
      mergeOptions('IsNotEmptyObject', { options }),
      mergeValidationOptions('IsNotEmptyObject', validationOptions),
    );
  } as PropertyDecoratorFn,

  ValidateNested: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.ValidateNested(
      mergeValidationOptions('ValidateNested', validationOptions),
    );
  } as PropertyDecoratorFn,

  ValidatePromise: function (
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return SDXClassValidatorMap.ValidatePromise(
      mergeValidationOptions('ValidatePromise', validationOptions),
    );
  } as PropertyDecoratorFn,
};
