import { getValue } from '@helpers/GetValue';

type StringToValue = (value: string, floatingNumbers?: number) => string;
export const stringToValue: StringToValue = (value, floatingNumbers = 2) => {
  const valueFixed = value.replace(/[^\d.,]/g, '');

  const [int, float] = valueFixed.split('.');

  let newPrice: string;

  if (int) {
    const intWithoutComma = int.replace(/,/g, '');

    const numberWithoutLeadingZeros = intWithoutComma.replace(/^0+/, '');

    const [intWithComma] = getValue(Number(numberWithoutLeadingZeros)).split(
      '.'
    );

    let intSplitedComma = intWithComma.split(',');
    intSplitedComma = intSplitedComma.filter((item) => item);

    const test = intSplitedComma.join(',');

    newPrice = String(test);
  } else newPrice = '0';

  if (float) {
    const newFloat = float.slice(0, floatingNumbers).replace(/[^\d]/g, '');

    newPrice += `.${newFloat}`;
  } else if (valueFixed.includes('.')) newPrice += '.';

  return newPrice;
};
