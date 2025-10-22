export function orderToPrisma(
  order: string | undefined,
): Array<Record<string, any>> | Record<string, any> | undefined {
  switch (order) {
    case 'deadline_asc':
      return [{ deadline: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }];
    case 'deadline_desc':
      return [{ deadline: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }];
    case 'created_asc':
      return { createdAt: 'asc' };
    case 'created_desc':
      return { createdAt: 'desc' };
    case 'priority_asc':
      return [{ priority: 'asc' }, { createdAt: 'desc' }];
    case 'priority_desc':
      return [{ priority: 'desc' }, { createdAt: 'desc' }];
    default:
      return undefined;
  }
}
