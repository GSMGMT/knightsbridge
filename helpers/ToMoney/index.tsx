const formatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  currency: 'USD',
  style: 'currency',
});

export const toMoney: (value: number) => string = (value) =>
  formatter.format(value);
