export const getNumberDecimalQuantity = (value: number) =>
  value.toString().split('.')[1]?.length ?? 0;

export const dineroFromFloat = (
  amount: number,
  digits: number
): Dinero.Options => ({
  amount: amount * 10 ** digits,
  precision: digits,
});
