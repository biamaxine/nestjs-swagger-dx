import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiQueryOptions } from '@nestjs/swagger';

export type SDXQueryDefaults = Partial<ApiQueryOptions>;

export type SDXQueries<Q extends string = string> = Record<
  Q,
  Partial<ApiQueryOptions>
>;

export function SDXQueries(
  queries: SDXQueries,
  defaults: SDXQueryDefaults = {},
) {
  const decorators = Object.entries(queries).map(([name, query]) =>
    ApiQuery({ ...defaults, ...query, name }),
  );

  return applyDecorators(...decorators);
}
