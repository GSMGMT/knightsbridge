export async function isPersisted(
  uid: string,
  f: (uid: string) => Promise<unknown>
) {
  const register = await f(uid);
  return !!register;
}
