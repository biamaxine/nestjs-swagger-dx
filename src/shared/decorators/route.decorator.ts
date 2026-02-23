import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiOperationOptions } from '@nestjs/swagger';

import { SDXParamDefaults, SDXParams } from './params.decorator';
import { SDXQueries, SDXQueryDefaults } from './queries.decorator';
import { SDXResponseDefaults, SDXResponses } from './responses.decorator';

interface SDXRouteModel {
  params?: SDXParams;
  queries?: SDXQueries;
  responses?: SDXResponses;
}

export type SDXRoute<T extends SDXRouteModel = SDXRouteModel> = {
  statusCode?: HttpStatus;
} & Omit<ApiOperationOptions, 'responses'> &
  T;

export interface SDXRouteDefaults {
  param?: SDXParamDefaults;
  query?: SDXQueryDefaults;
  response?: SDXResponseDefaults;
}

export function SDXRoute(route: SDXRoute, defaults: SDXRouteDefaults = {}) {
  const { statusCode, params, queries, responses, ...operation } = route;

  const decorators = [ApiOperation(operation)];

  if (statusCode) decorators.push(HttpCode(statusCode));
  if (params) decorators.push(SDXParams(params, defaults.param));
  if (queries) decorators.push(SDXQueries(queries, defaults.query));
  if (responses) decorators.push(SDXResponses(responses, defaults.response));

  return applyDecorators(...decorators);
}
