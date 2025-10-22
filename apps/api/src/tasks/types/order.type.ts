export const OrderValues = [
  'deadline_asc',
  'deadline_desc',
  'created_asc',
  'created_desc',
  'priority_asc',
  'priority_desc',
] as const;

export type Order = (typeof OrderValues)[number];
