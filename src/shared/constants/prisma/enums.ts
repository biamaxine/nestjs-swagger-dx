export const SortOrder = {
  asc: 'asc',
  desc: 'desc',
} as const;

export type SortOrder = keyof typeof SortOrder;

export const NullsOrder = {
  first: 'first',
  last: 'last',
} as const;

export type NullsOrder = keyof typeof NullsOrder;
