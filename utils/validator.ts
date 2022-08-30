import { Sort } from './types';

export async function isPersisted(
  uid: string,
  f: (uid: string) => Promise<unknown>
) {
  const register = await f(uid);
  return !!register;
}

export function parseSortField(sortField: string): Sort[] {
  return sortField.split(',').map((param: string): Sort => {
    if (/^-/.test(param)) {
      return { field: param.slice(1), orientation: 'desc' };
    }
    return { field: param, orientation: 'asc' };
  });
}
