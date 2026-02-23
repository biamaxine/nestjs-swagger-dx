import { applyDecorators } from '@nestjs/common';
import { ApiParam, ApiParamOptions } from '@nestjs/swagger';

export type SDXParamDefaults = Partial<ApiParamOptions>;

export type SDXParams<P extends string = string> = Record<
  P,
  Partial<ApiParamOptions>
>;

export function SDXParams(params: SDXParams, defaults: SDXParamDefaults = {}) {
  const decorators = Object.entries(params).map(([name, param]) =>
    ApiParam({ ...defaults, ...param, name }),
  );

  return applyDecorators(...decorators);
}
