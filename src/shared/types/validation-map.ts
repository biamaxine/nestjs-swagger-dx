import {
  IsNumberOptions,
  IsStrongPasswordOptions,
  ValidateByOptions,
} from 'class-validator';
import { CountryCode } from 'libphonenumber-js/max';

export interface SDXValidationMap {
  Allow?: undefined;
  ArrayNotEmpty?: undefined;
  ArrayUnique?: undefined;

  IsDefined?: undefined;
  IsOptional?: undefined;
  IsLatLong?: undefined;
  IsLatitude?: undefined;
  IsLongitude?: undefined;
  IsEmpty?: undefined;
  IsNotEmpty?: undefined;
  IsPositive?: undefined;
  IsNegative?: undefined;
  IsAlpha?: { locale?: validator.AlphaLocale };
  IsAlphanumeric?: { locale?: validator.AlphanumericLocale };
  IsDecimal?: { options?: validator.IsDecimalOptions };
  IsAscii?: undefined;
  IsBase64?: { options?: validator.IsBase64Options };
  IsCreditCard?: undefined;
  IsCurrency?: { options?: validator.IsCurrencyOptions };
  IsEmail?: { options?: validator.IsEmailOptions };
  IsFQDN?: { options?: validator.IsFQDNOptions };
  IsFullWidth?: undefined;
  IsHalfWidth?: undefined;
  IsVariableWidth?: undefined;
  IsHexColor?: undefined;
  IsHexadecimal?: undefined;
  IsMACAddress?: { options?: validator.IsMACAddressOptions };
  IsIP?: { version?: validator.IPVersion };
  IsPort?: undefined;
  IsISBN?: { version?: validator.ISBNVersion };
  IsISIN?: undefined;
  IsISO8601?: { options?: validator.IsISO8601Options };
  IsJSON?: undefined;
  IsJWT?: undefined;
  IsLowercase?: undefined;
  IsMobilePhone?: {
    locale?: validator.MobilePhoneLocale;
    options?: validator.IsMobilePhoneOptions;
  };
  IsISO31661Alpha2?: undefined;
  IsISO31661Alpha3?: undefined;
  IsMongoId?: undefined;
  IsMultibyte?: undefined;
  IsSurrogatePair?: undefined;
  IsUrl?: { options?: validator.IsURLOptions };
  IsUUID?: { version?: validator.UUIDVersion };
  IsFirebasePushId?: undefined;
  IsUppercase?: undefined;
  IsPhoneNumber?: { region?: CountryCode };
  IsMilitaryTime?: undefined;
  IsHash?: { algorithm: string };
  IsISSN?: { options?: validator.IsISSNOptions };
  IsDateString?: { options?: validator.IsISO8601Options };
  IsBooleanString?: undefined;
  IsNumberString?: { options?: validator.IsNumericOptions };
  IsBase32?: undefined;
  IsBIC?: undefined;
  IsBtcAddress?: undefined;
  IsDataURI?: undefined;
  IsEAN?: undefined;
  IsEthereumAddress?: undefined;
  IsHSL?: undefined;
  IsIBAN?: undefined;
  IsIdentityCard?: { locale?: validator.IdentityCardLocale };
  IsISRC?: undefined;
  IsLocale?: undefined;
  IsMagnetURI?: undefined;
  IsMimeType?: undefined;
  IsOctal?: undefined;
  IsPassportNumber?: { countryCode: CountryCode };
  IsPostalCode?: { locale?: 'any' | validator.PostalCodeLocale };
  IsRFC3339?: undefined;
  IsRgbColor?: { includePercentValues?: boolean };
  IsSemVer?: undefined;
  IsStrongPassword?: { options?: IsStrongPasswordOptions };
  IsTimeZone?: undefined;
  IsBase58?: undefined;
  IsTaxId?: { locale?: string };
  IsISO4217CurrencyCode?: undefined;
  IsBoolean?: undefined;
  IsDate?: undefined;
  IsNumber?: { options?: IsNumberOptions };
  IsInt?: undefined;
  IsString?: undefined;
  IsArray?: undefined;
  IsObject?: undefined;
  IsNotEmptyObject?: { options?: { nullable?: boolean } };

  ValidateNested?: undefined;
  ValidatePromise?: undefined;
}

export interface SDXValidationWithInputMap {
  ArrayContains: [values: any[]];
  ArrayNotContains: [values: any[]];
  ArrayMinSize: [min: number];
  ArrayMaxSize: [max: number];

  Contains: [seed: string];

  Equals: [comparison: any];

  IsIn: [values: readonly any[]];
  IsNotIn: [values: readonly any[]];
  IsDivisibleBy: [num: number];
  IsByteLength: [min: number, max?: number];
  IsEnum: [entity: object];
  IsInstance: [targetType: new (...args: any[]) => any];

  Length: [min: number, max?: number];

  Matches: [pattern: RegExp];
  Max: [maxValue: number];
  Min: [minValue: number];
  MinDate: [date: Date | (() => Date)];
  MaxDate: [date: Date | (() => Date)];
  MaxLength: [max: number];
  MinLength: [min: number];

  NotContains: [seed: string];
  NotEquals: [comparison: any];

  Validate: [constraintClass: Function];
  ValidateBy: [options: ValidateByOptions];
  ValidateIf: [condition: (object: any, value: any) => boolean];
}

export type SDXValidation = keyof SDXValidationMap;
export type SDXValidationWithInput = keyof SDXValidationWithInputMap;
