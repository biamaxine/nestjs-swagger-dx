import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

export type SDXResponseDefaults = Partial<ApiResponseOptions>;

export type SDXResponses<
  R extends keyof typeof HttpStatus = keyof typeof HttpStatus,
> = keyof typeof HttpStatus extends R
  ? Partial<Record<R, ApiResponseOptions>>
  : Record<R, ApiResponseOptions>;

export function SDXResponses(
  responses: SDXResponses,
  defaults: SDXResponseDefaults = {},
) {
  const decorators = Object.entries(responses).map(([statusName, response]) =>
    ApiResponse({
      ...defaults,
      ...response,
      description: response.description
        ? `[${statusName}]: ${response.description}`
        : undefined,
      status: HttpStatus[statusName as keyof typeof HttpStatus],
    }),
  );

  return applyDecorators(...decorators);
}
