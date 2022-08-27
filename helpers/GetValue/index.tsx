import { toMoney } from '../ToMoney';

export const getValue: (oldValue: number, currency?: boolean) => string = (
  oldValue,
  currency = false
) => {
  let newValue: string = '';

  if (oldValue >= 1 || oldValue === 0) {
    newValue = toMoney(oldValue).replace('$', '').trim();
  } else {
    let firstNumberIsAppearing: boolean = false;
    let zeroCounter: number = 0;

    const fullPrice = oldValue.toFixed(100);
    const fullPriceSplited = fullPrice.split('.');

    const decimalPriceSplited = fullPriceSplited[1].split('');
    const decimalPriceWithoutZerosInBegin = decimalPriceSplited
      .filter((char) => {
        if (firstNumberIsAppearing) {
          return char;
        }
        if (char !== '0') {
          firstNumberIsAppearing = true;

          return char;
        }

        zeroCounter += 1;

        return false;
      })
      .join('');
    const decimalPrice = decimalPriceWithoutZerosInBegin.slice(0, 3);

    if (zeroCounter <= 3) {
      newValue = oldValue.toFixed(5);
    } else {
      newValue = `0.0...${decimalPrice}`;
    }
  }

  if (currency) {
    newValue = `$${newValue}`;
  }

  return newValue;
};
