import {
  ChangeEventHandler,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';

import { api } from '@services/api';

import { getValue } from '@helpers/GetValue';
import { stringToValue } from '@helpers/StringToValue';

import { Icon } from '@components/Icon';
import { Dropdown } from '@components/Dropdown';
import { Dropdown as CustomDropdown } from '../Dropdown';

import { Addresses, Coins } from '../types';

import styles from './DepositDetails.module.scss';

interface DepositDetailsProps {
  goNext: () => void;
  coins: Coins;
  addresses: Addresses;
  setCoinSelectedIndex: (index: number) => void;
  setNetworkSelectedIndex: (index: number) => void;
  setAmount: (amount: number) => void;
}
export const DepositDetails = ({
  goNext,
  coins,
  addresses,
  setAmount,
  setCoinSelectedIndex,
  setNetworkSelectedIndex,
}: DepositDetailsProps) => {
  const currencyOptions = useMemo(() => {
    const newOptions = coins.map(({ name }) => name);

    return [...newOptions];
  }, [coins]);
  const [currency, setCurrency] = useState<string>(currencyOptions[0]);
  const currentCurrency = useMemo(() => {
    const selectedCurrency = coins.find(({ name }) => currency === name);

    return selectedCurrency;
  }, [coins, currency]);

  const networks = useMemo(() => {
    if (!currentCurrency) return [];

    const { walletAddresses } = addresses.find(
      ({ uid: id }) => id === currentCurrency.uid
    )!;

    const networksCurrentAddres = walletAddresses?.map(
      ({ network }) => network
    );

    return networksCurrentAddres || [];
  }, [addresses, currentCurrency]);
  const [network, setNetwork] = useState<string>(networks[0]);
  useEffect(() => {
    setNetwork(networks[0]);
  }, [currentCurrency, networks]);

  const [price, setPrice] = useState<string>('50');
  const value = useMemo(() => {
    const removingCommas = price.replace(/,/g, '');

    return Number(removingCommas);
  }, [price]);
  const valueInUSD = useMemo(() => {
    if (!currentCurrency) return Number(value).toFixed(2);

    let { quote: currencyPrice } = currentCurrency;

    currencyPrice = currencyPrice || 1;

    const convertedValue = value * currencyPrice;

    return getValue(convertedValue);
  }, [value, currentCurrency]);

  const coinSelectedIndex = useMemo(() => {
    const index = coins.findIndex(({ name }) => name === currency);

    return index >= 0 ? index : null;
  }, [coins, currency]);
  const networkSelectedIndex = useMemo(() => {
    const index = addresses[coinSelectedIndex!]?.walletAddresses.findIndex(
      ({ network: addressNetwork }) => addressNetwork === network
    );

    return index >= 0 ? index : null;
  }, [network, addresses, coinSelectedIndex]);

  const minAmount = useMemo(() => {
    if (!currentCurrency) return 0;

    let { quote: currencyPrice } = currentCurrency!;

    currencyPrice = currencyPrice || 1;

    const min = 2 / Number(getValue(currencyPrice).replace(/,/g, ''));

    return min;
  }, [currentCurrency]);
  const canProceed = useMemo(() => {
    const newValue = Number(value);

    return newValue >= minAmount;
  }, [value, minAmount]);
  const canSubmit = useMemo(() => canProceed, [canProceed]);
  const handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> =
    useCallback(
      async (event) => {
        event.preventDefault();

        if (canProceed) {
          setAmount(value);
          setCoinSelectedIndex(coinSelectedIndex!);
          setNetworkSelectedIndex(networkSelectedIndex!);

          goNext();
        }
      },
      [canProceed, goNext, value, coinSelectedIndex, networkSelectedIndex]
    );

  const priceVariants = useMemo(() => [50, 100, 200, 500], []);

  const setValue: (value: string) => void = useCallback((newValue) => {
    const newPrice = stringToValue(newValue, 10);

    setPrice(newPrice);
  }, []);
  const handleSetValue: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { value: newValue } }) => {
      setValue(newValue);
    },
    [setValue]
  );

  const [fetching, setFetching] = useState<boolean>(false);
  const [walletAmount, setWalletAmount] = useState<number>(0);
  const fetchWalletAmount = useCallback(async () => {
    if (coinSelectedIndex === null || fetching) return;

    setFetching(true);

    try {
      const {
        data: { data: amount },
      } = await api.get<{ data: number }>(
        `/api/currency/${coins[coinSelectedIndex].uid}/balance`
      );

      setWalletAmount(amount);
    } finally {
      setFetching(false);
    }
  }, [coinSelectedIndex, coins]);
  useEffect(() => {
    fetchWalletAmount();
  }, [fetchWalletAmount]);

  return (
    <form className={styles.item} onSubmit={handleSubmit}>
      <div className={styles.title} data-testid="title">
        Select coin and network
      </div>
      <div className={styles.selects}>
        {coins.length > 0 && (
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.label}>Select currency</div>
              <CustomDropdown
                className={styles.dropdown}
                classDropdownHead={styles.dropdownHead}
                value={currency}
                setValue={setCurrency}
                options={coins}
              />
              {coinSelectedIndex !== null && (
                <div
                  className={cn(styles.wallet, { [styles.fetching]: fetching })}
                >
                  <Icon name="wallet" fill="currentColor" />{' '}
                  {getValue(walletAmount)} {coins[coinSelectedIndex!].symbol}
                </div>
              )}
            </div>
          </div>
        )}

        {networks.length > 0 && (
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.label}>Network</div>
              <Dropdown
                className={styles.dropdown}
                classDropdownHead={styles.dropdownHead}
                value={network}
                setValue={setNetwork}
                options={networks}
              />
            </div>
          </div>
        )}
      </div>
      <div className={styles.label}>Enter amount</div>
      <div className={styles.payment}>
        <div className={styles.field}>
          <div className={styles.value}>{price}</div>
          <input
            className={styles.input}
            value={price}
            onChange={handleSetValue}
            type="text"
            data-testid="input-value"
          />
        </div>
        <div className={cn('h4', styles.sign)}>{currentCurrency?.symbol}</div>
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
          Continue
        </button>
      </div>
    </form>
  );
};
