import {
  useState,
  useId,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import cn from 'classnames';
import { Range, getTrackBackground } from 'react-range';
import axios, { AxiosError } from 'axios';

import { ExchangeContext } from '@store/contexts/Exchange';

import { api } from '@services/api';

import { Icon } from '@components/Icon';

import { stringToValue } from '@helpers/StringToValue';

import styles from '../Action.module.scss';

interface SellProps {
  classButton: string;
  buttonText: string;
}
export const Sell = ({ classButton, buttonText }: SellProps) => {
  const {
    walletPortfolio: {
      base: { amount: baseWalletAmount },
    },
    handleFetchBaseCurrencyWallet,
    pair,
  } = useContext(ExchangeContext);
  const {
    base: { slug: baseSlug },
    pair: { slug: pairSlug },
    price,
    id,
  } = useMemo(() => pair!, [pair]);

  const [transactionFail, setTransactionFail] = useState<boolean>(false);
  const removeTransactionFailFeedback = useCallback(() => {
    setTransactionFail(false);
  }, []);
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (transactionFail) {
      timer = setTimeout(removeTransactionFailFeedback, 300);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [transactionFail, removeTransactionFailFeedback]);

  const [percentage, setPercentage] = useState<number>(0);

  const [cryptoAmount, setCryptoAmount] = useState<string>('0');
  const cryptoAmountInputValue = useMemo(
    () => cryptoAmount.replace(/^0+/, ''),
    [cryptoAmount]
  );
  const cryptoAmountValue = useMemo(
    () => Number(cryptoAmount) || 0,
    [cryptoAmount]
  );

  const [fiatAmount, setFiatAmount] = useState<string>('0');
  const fiatAmountInputValue = useMemo(
    () => fiatAmount.replace(/^0+/, ''),
    [fiatAmount]
  );
  const fiatAmountValue = useMemo(() => Number(fiatAmount) || 0, [fiatAmount]);

  useEffect(() => {
    setFiatAmount('0');
    setCryptoAmount('0');
  }, [pair, baseWalletAmount]);

  const [fetching, setFetching] = useState<boolean>(false);

  const canSubmit = useMemo(
    () => percentage > 0 && !fetching,
    [percentage, fetching]
  );

  const minPrice = 0;
  const stepPrice = 25;
  const maxPrice = 100;

  const priceId = useId();
  const amountId = useId();

  const [lastChange, setLastChange] = useState<'CRYPTO' | 'FIAT'>('CRYPTO');

  const valueIsMajor = useMemo(
    () => baseWalletAmount < cryptoAmountValue,
    [baseWalletAmount, cryptoAmountValue]
  );

  useEffect(() => {
    if (fiatAmountValue < 0) {
      setFiatAmount('0');
    }
  }, [fiatAmountValue]);
  useEffect(() => {
    if (cryptoAmountValue < 0) {
      setCryptoAmount('0');
    }
  }, [cryptoAmountValue]);

  useEffect(() => {
    if (lastChange === 'CRYPTO') {
      const newFiatAmount = cryptoAmountValue * price;

      setFiatAmount(newFiatAmount.toString());
    }
  }, [cryptoAmountValue, price, lastChange]);
  useEffect(() => {
    if (lastChange === 'FIAT') {
      const newCryptoAmount = fiatAmountValue / price;

      setCryptoAmount(newCryptoAmount.toString());
    }
  }, [fiatAmountValue, price, lastChange]);

  useEffect(() => {
    let newPercentage = 0;

    newPercentage = (cryptoAmountValue / baseWalletAmount) * 100;

    if (newPercentage > 100 || !newPercentage) {
      newPercentage = 0;
    }

    setPercentage(newPercentage);
  }, [cryptoAmountValue, baseWalletAmount]);

  const handleSell: () => Promise<void> = useCallback(async () => {
    try {
      setFetching(true);

      await api.post('/api/order/create', {
        type: 'SELL',
        marketPairId: id,
        amount: cryptoAmountValue,
      });

      setPercentage(0);

      await handleFetchBaseCurrencyWallet();
    } catch (errorHandler: any) {
      if (axios.isAxiosError(errorHandler)) {
        const error = errorHandler as AxiosError<{ message: string }>;

        const { message } = error.response!.data;
        console.error({ message });

        setTransactionFail(true);
      }
    } finally {
      setFetching(false);
    }
  }, [cryptoAmountValue, pair, handleFetchBaseCurrencyWallet]);

  const handleSubmitOrder = useCallback(() => handleSell(), [handleSell]);

  return (
    <div className={cn(styles.box, { [styles.wrong]: transactionFail })}>
      <label
        className={cn(styles.field, { [styles.exceeded]: valueIsMajor })}
        htmlFor={priceId}
      >
        <div className={styles.label}>Amount {valueIsMajor && 'exceeds'}</div>
        <input
          type="number"
          className={styles.input}
          value={cryptoAmountInputValue}
          onChange={({ target: { value } }) => setCryptoAmount(value)}
          placeholder="0"
          id={priceId}
          autoComplete="off"
          onFocus={() => {
            setCryptoAmount('0');
            setLastChange('CRYPTO');
          }}
        />
        <div className={styles.currency}>
          <span>{baseSlug}</span>
        </div>
      </label>
      <label
        className={cn(styles.field, { [styles.exceeded]: valueIsMajor })}
        htmlFor={amountId}
      >
        <div className={styles.label}>Price</div>
        <input
          type="number"
          className={styles.input}
          value={fiatAmountInputValue}
          onChange={({ target: { value } }) => setFiatAmount(value)}
          placeholder="0"
          id={amountId}
          autoComplete="off"
          onFocus={() => {
            setFiatAmount('0');
            setLastChange('FIAT');
          }}
        />
        <div className={styles.currency}>
          <span>{pairSlug}</span>
        </div>
      </label>
      <span className={styles.wallet}>
        <Icon name="wallet" /> {stringToValue(baseWalletAmount.toString(), 12)}{' '}
        {baseSlug}
      </span>
      <Range
        values={[percentage]}
        step={stepPrice}
        min={minPrice}
        max={maxPrice}
        onChange={([newValue]) => {
          setPercentage(newValue);

          const newCryptoAmount = (baseWalletAmount / 100) * newValue;
          setCryptoAmount(newCryptoAmount.toString());

          setLastChange('CRYPTO');
        }}
        disabled={baseWalletAmount === 0}
        renderMark={({ props: { style, ...props }, index }) => (
          <div
            {...props}
            style={{
              ...style,
              height: '6px',
              width: '2px',
              marginTop: '-2px',
              borderRadius: '1px',
              backgroundColor:
                index * stepPrice < percentage ? '#3772FF' : '#E6E8EC',
              transition: '0.3s all',
            }}
          />
        )}
        renderTrack={({
          props: { onMouseDown, onTouchStart, ref, style },
          children,
        }) => (
          <div
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            style={{
              ...style,
              height: '36px',
              display: 'flex',
              width: '100%',
            }}
            role="button"
            tabIndex={0}
          >
            <div
              ref={ref}
              style={{
                height: '2px',
                width: '100%',
                borderRadius: '1px',
                background: getTrackBackground({
                  values: [percentage],
                  colors: ['#3772FF', '#E6E8EC'],
                  min: minPrice,
                  max: maxPrice,
                }),
                alignSelf: 'center',
                transition: '0.3s all',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props: { style, ...props } }) => (
          <div
            {...props}
            style={{
              ...style,
              height: '18px',
              width: '18px',
              borderRadius: '50%',
              backgroundColor: '#F4F5F6',
              border: '4px solid #777E90',
              boxShadow: '0px 8px 16px -8px rgba(15, 15, 15, 0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: '0.3s all',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-27px',
                color: '#FCFCFD',
                fontWeight: '600',
                fontSize: '13px',
                lineHeight: '16px',
                fontFamily: 'Poppins',
                padding: '2px 6px',
                borderRadius: '6px',
                backgroundColor: '#777E90',
                transition: '0.3s all',
              }}
            >
              {percentage.toFixed(0)}%
            </div>
          </div>
        )}
      />
      <span className={styles.fee}>
        <Icon name="lightning" /> Fee 1.5%
      </span>
      <button
        className={cn(classButton, styles.button)}
        type="button"
        onClick={handleSubmitOrder}
        disabled={!canSubmit}
      >
        {buttonText}
      </button>
    </div>
  );
};
