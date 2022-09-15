import {
  ChangeEventHandler,
  FormEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';

import { Dropdown } from '@components/Dropdown';

import { FiatCurrency, Bank } from '@pages/app/deposit/fiat';

import { getValue } from '@helpers/GetValue';
import { stringToValue } from '@helpers/StringToValue';

import { createDeposit } from '@services/api/app/deposit/create';
import { Request } from '../types';

import styles from './SelectCurrency.module.scss';

interface SelectCurrencyProps {
  goNext: () => void;
  setRequestInfo: (requestInfo: Request) => void;
  currencies: FiatCurrency[];
  banks: Bank[];
}
export const SelectCurrency = ({
  goNext,
  setRequestInfo,
  banks,
  currencies,
}: SelectCurrencyProps) => {
  const currencyOptions = useMemo(() => {
    const newOptions = currencies.map((currency) => currency.symbol);

    return [...newOptions];
  }, [currencies]);
  const [currency, setCurrency] = useState<string>(currencyOptions[0]);
  const currentCurrency = useMemo(() => {
    const selectedCurrency = currencies.find(
      ({ symbol }) => currency === symbol
    );

    return selectedCurrency;
  }, [currencies, currency]);

  const paymentOptions = useMemo(() => {
    const newOptions = banks.map((payment) => payment.paymentMethod);

    return [...newOptions];
  }, [banks]);
  const [payment, setPayment] = useState<string>(paymentOptions[0]);
  const currentPayment = useMemo(() => {
    const selectedPayment = banks.find(
      ({ paymentMethod }) => payment === paymentMethod
    );

    return selectedPayment;
  }, [banks, payment]);

  const [price, setPrice] = useState<string>('50');
  const value = useMemo(() => {
    const removingCommas = price.replace(/,/g, '');

    return Number(removingCommas);
  }, [price]);
  const valueInUSD = useMemo(() => {
    if (!currentCurrency) return Number(value).toFixed(2);

    const { quote } = currentCurrency;

    if (!quote) return getValue(value);

    const convertedValue = value * quote;

    return getValue(convertedValue);
  }, [value, currentCurrency]);

  const [fetching, setFetching] = useState<boolean>(false);
  const minAmount = useMemo(() => {
    const { quote } = currentCurrency!;

    if (!quote) return 0;

    const min = Number(getValue(20 * quote).replace(/,/g, ''));

    return min;
  }, [currentCurrency]);
  const canProceed = useMemo(() => {
    const newValue = Number(value);

    return newValue >= minAmount;
  }, [value, minAmount]);
  const canSubmit = useMemo(
    () => !fetching && canProceed && !!currentCurrency && !!currentPayment,
    [fetching, canProceed]
  );
  const handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> =
    useCallback(
      async (event) => {
        event.preventDefault();

        if (canProceed && canSubmit) {
          setFetching(true);

          try {
            const { uid, referenceNo } = await createDeposit({
              amount: value,
              bankId: currentPayment!.uid,
              currencyId: currentCurrency!.uid,
            })!;

            setRequestInfo({
              id: uid!,
              referenceNumber: referenceNo,
              amount: valueInUSD,
              currency: currentCurrency!,
              bank: currentPayment!,
            });

            goNext();
          } catch {
            setFetching(false);
          }
        }
      },
      [
        canProceed,
        currentCurrency,
        goNext,
        currentPayment,
        setRequestInfo,
        value,
        valueInUSD,
      ]
    );

  const priceVariants = useMemo(() => [50, 100, 200, 500], []);

  const setValue: (value: string) => void = useCallback(
    (newValue) => {
      if (fetching) return;

      const newPrice = stringToValue(newValue);

      setPrice(newPrice);
    },
    [fetching]
  );
  const handleSetValue: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { value: newValue } }) => {
      setValue(newValue);
    },
    [setValue]
  );

  return (
    <form className={styles.item} onSubmit={handleSubmit}>
      <div className={styles.title} data-testid="title">
        Select currency and payment method
      </div>
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.label}>Select currency</div>
          <Dropdown
            className={styles.dropdown}
            classDropdownHead={styles.dropdownHead}
            value={currency}
            setValue={setCurrency}
            options={currencyOptions}
          />
        </div>
        <div className={styles.col}>
          <div className={styles.label}>Select payment</div>
          <Dropdown
            className={styles.dropdown}
            classDropdownHead={styles.dropdownHead}
            value={payment}
            setValue={setPayment}
            options={paymentOptions}
          />
        </div>
      </div>
      <div className={styles.label}>Amount</div>
      <div className={styles.payment}>
        <div className={cn('h4', styles.sign)}>{currentCurrency!.sign}</div>
        <div className={styles.field}>
          <div className={styles.value}>{price}</div>
          <input
            className={styles.input}
            value={price}
            onChange={handleSetValue}
            type="text"
            data-testid="input-value"
            disabled={fetching}
          />
        </div>
      </div>
      <div className={styles.price} data-testid="usd-price">
        {valueInUSD} <span>USD</span>
      </div>
      <div className={styles.variants}>
        {priceVariants.map((variant) => (
          <button
            className={cn('button-stroke button-small', styles.button, {
              active: variant === Number(price),
            })}
            type="button"
            onClick={() => setValue(String(variant))}
            key={variant}
            disabled={fetching}
            data-testid={`price-variant-${variant}`}
          >
            {variant}
          </button>
        ))}
      </div>
      <p className={styles.minimum}>
        {currentCurrency?.symbol} {getValue(minAmount)} Minimum amount
      </p>
      <div className={styles.btns}>
        <button
          className={cn('button', styles.button)}
          type="submit"
          disabled={!canSubmit}
          data-testid="submit-button"
        >
          {fetching ? 'Loading...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};
