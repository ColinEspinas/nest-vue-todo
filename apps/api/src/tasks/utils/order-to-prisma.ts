export function orderToPrisma(
  order: string | undefined,
): { [key: string]: 'asc' | 'desc' } | { [key: string]: 'asc' | 'desc' }[] | undefined {
  switch (order) {
    case 'deadline_asc':
      return [{ deadline: 'asc' }, { createdAt: 'asc' }];
    case 'deadline_desc':
      return [{ deadline: 'desc' }, { createdAt: 'asc' }];
    case 'created_asc':
      return { createdAt: 'asc' };
    case 'created_desc':
      return { createdAt: 'desc' };
    case 'priority_asc':
      return [{ priority: 'asc' }, { createdAt: 'asc' }];
    case 'priority_desc':
      return [{ priority: 'desc' }, { createdAt: 'asc' }];
    default:
      return undefined;
  }
}
