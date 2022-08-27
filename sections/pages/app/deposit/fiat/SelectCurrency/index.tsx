import {
  ChangeEventHandler,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';

import { Dropdown } from '@components/Dropdown';

// import { api } from '@services/api';

import { getValue } from '@helpers/GetValue';
import { stringToValue } from '@helpers/StringToValue';

import { Request } from '..';

import styles from './SelectCurrency.module.scss';

interface Currency {
  id: string;
  name: string;
  code: string;
  quote: number;
  symbol: string;
}
interface PaymentMethod {
  id: string;
  code: string;
}
interface SelectCurrencyProps {
  goNext: () => void;
  setRequestInfo: (requestInfo: Request) => void;
}
export const SelectCurrency = ({
  goNext,
  setRequestInfo,
}: SelectCurrencyProps) => {
  const [currencies, setCurrencies] = useState<Array<Currency>>([
    { code: 'USD', name: 'Dollar', id: '', quote: 1, symbol: '$' },
  ]);
  const currencyOptions = useMemo(() => {
    const newOptions = currencies.map((currency) => currency.code);

    return [...newOptions];
  }, [currencies]);
  const [currency, setCurrency] = useState<string>(currencyOptions[0]);
  const currentCurrency = useMemo(() => {
    const selectedCurrency = currencies.find(({ code }) => currency === code);

    return selectedCurrency;
  }, [currencies, currency]);
  useEffect(() => {
    (async () => {
      // const {
      //   data: { data: fetchedData },
      // } = await api.get('/api/admin/currency');

      const data = [
        {
          code: 'USD',
          id: 'y87234hn',
          name: 'US Dollar',
          quote: 1,
          symbol: '$',
        },
      ] as Array<Currency>;

      setCurrencies([...data]);
    })();
  }, []);

  const [paymentMethods] = useState<Array<PaymentMethod>>([
    { code: 'Bank (SWIFT)', id: '12345678' },
  ]);
  const paymentOptions = useMemo(() => {
    const newOptions = paymentMethods.map((payment) => payment.code);

    return [...newOptions];
  }, [paymentMethods]);
  const [payment, setPayment] = useState<string>(paymentOptions[0]);
  const paymentId = useMemo(() => {
    const selectedPayment = paymentMethods.find(({ code }) => payment === code);

    return selectedPayment?.id;
  }, [paymentMethods, payment]);

  const [price, setPrice] = useState<string>('50');
  const value = useMemo(() => {
    const removingCommas = price.replace(/,/g, '');

    return Number(removingCommas);
  }, [price]);
  const valueInUSD = useMemo(() => {
    if (!currentCurrency) return Number(value).toFixed(2);

    const { quote } = currentCurrency;

    const convertedValue = value * quote;

    return getValue(convertedValue);
  }, [value, currentCurrency]);

  const [fetching, setFetching] = useState<boolean>(false);
  const minAmount = useMemo(() => {
    const { quote } = currentCurrency!;

    const min = Number(getValue(20 * quote).replace(/,/g, ''));

    return min;
  }, [currentCurrency]);
  const canProceed = useMemo(() => {
    const newValue = Number(value);

    return newValue >= minAmount;
  }, [value, minAmount]);
  const canSubmit = useMemo(
    () => !fetching && canProceed,
    [fetching, canProceed]
  );
  const handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> =
    useCallback(
      async (event) => {
        event.preventDefault();

        if (canProceed) {
          setFetching(true);

          try {
            // const {
            //   data: { data },
            // } = await api.post('/api/fiat/deposit', {
            //   currencyId: currentCurrency?.id,
            //   bankId: paymentId,
            //   amount: value,
            // });

            setRequestInfo({
              id: 'dgffdag8709nba08237',
              referenceNumber: '7ds6bfsda79fb63',
              amount: valueInUSD,
              currency: currentCurrency!.code,
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
        paymentId,
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
        <div className={cn('h4', styles.sign)}>{currentCurrency!.symbol}</div>
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
        {currentCurrency?.code} {getValue(minAmount)} Minimum amount
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
