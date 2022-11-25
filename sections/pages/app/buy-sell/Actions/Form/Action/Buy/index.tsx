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

interface BuyProps {
  classButton: string;
  buttonText: string;
}
export const Buy = ({ classButton, buttonText }: BuyProps) => {
  const {
    walletPortfolio: {
      pair: { amount: pairWalletAmount },
    },
    handleFetchPairCurrencyWallet,
    pair,
    action,
  } = useContext(ExchangeContext);
  const {
    base: { slug: baseSlug },
    pair: { slug: pairSlug },
    price,
    id,
  } = useMemo(() => pair!, [pair]);

  const isLimit = useMemo(() => action === 'limit', [action]);

  const [expectedPrice, setExpectedPrice] = useState<string>('');
  const expectPriceInputValue = useMemo(
    () => expectedPrice.replace(/^0+/, ''),
    [expectedPrice]
  );
  const expectedPriceValue = useMemo(
    () => Number(expectedPrice) || 0,
    [expectedPrice]
  );

  const currentPrice = useMemo(() => {
    if (isLimit && expectedPrice) return expectedPriceValue;

    return price;
  }, [price, expectedPriceValue, action, isLimit, expectedPrice]);

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

  const [fiatAmount, setFiatAmount] = useState<string>('0');
  const fiatAmountInputValue = useMemo(
    () => fiatAmount.replace(/^0+/, ''),
    [fiatAmount]
  );
  const fiatAmountValue = useMemo(() => Number(fiatAmount) || 0, [fiatAmount]);

  const [cryptoAmount, setCryptoAmount] = useState<string>('0');
  const cryptoAmountInputValue = useMemo(
    () => cryptoAmount.replace(/^0+/, ''),
    [cryptoAmount]
  );
  const cryptoAmountValue = useMemo(
    () => Number(cryptoAmount) || 0,
    [cryptoAmount]
  );

  useEffect(() => {
    setFiatAmount('0');
    setCryptoAmount('0');
  }, [pair, pairWalletAmount]);

  const [fetching, setFetching] = useState<boolean>(false);

  const minPrice = 0;
  const stepPrice = 25;
  const maxPrice = 100;

  const priceId = useId();
  const amountId = useId();
  const expectedId = useId();

  const [lastChange, setLastChange] = useState<'CRYPTO' | 'FIAT'>('CRYPTO');

  const valueIsMajor = useMemo(
    () => pairWalletAmount < fiatAmountValue,
    [pairWalletAmount, fiatAmountValue]
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
    if (lastChange === 'FIAT') {
      const newCryptoAmount = fiatAmountValue / currentPrice;

      setCryptoAmount(newCryptoAmount.toString());
    }
  }, [fiatAmountValue, currentPrice, lastChange]);
  useEffect(() => {
    if (lastChange === 'CRYPTO') {
      const newFiatAmount = cryptoAmountValue * currentPrice;

      setFiatAmount(newFiatAmount.toString());
    }
  }, [cryptoAmountValue, currentPrice, lastChange]);

  useEffect(() => {
    let newPercentage = 0;

    newPercentage = (fiatAmountValue / pairWalletAmount) * 100;

    if (newPercentage > 100 || !newPercentage) {
      newPercentage = 0;
    }

    setPercentage(newPercentage);
  }, [fiatAmountValue, pairWalletAmount]);

  useEffect(() => {
    (async () => {
      await handleFetchPairCurrencyWallet();
    })();
  }, [pair]);

  const handleBuy: () => Promise<void> = useCallback(async () => {
    try {
      setFetching(true);

      await api.post('/api/order', {
        type: 'buy',
        marketPairId: id,
        amount: cryptoAmountValue,
        action,
        quoteExpected: currentPrice,
      });

      setPercentage(0);

      await handleFetchPairCurrencyWallet();
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
  }, [
    cryptoAmountValue,
    pair,
    handleFetchPairCurrencyWallet,
    action,
    currentPrice,
  ]);
  const canSubmit = useMemo(
    () => !valueIsMajor && percentage > 0 && !fetching,
    [percentage, fetching, valueIsMajor]
  );

  const handleSubmitOrder = useCallback(() => handleBuy(), [handleBuy]);

  return (
    <div className={cn(styles.box, { [styles.wrong]: transactionFail })}>
      <label
        className={cn(styles.field, { [styles.exceeded]: valueIsMajor })}
        htmlFor={amountId}
      >
        <div className={styles.label}>Amount</div>
        <input
          type="number"
          className={styles.input}
          min={0}
          value={cryptoAmountInputValue}
          onChange={({ target: { value } }) => setCryptoAmount(value)}
          placeholder="0"
          id={amountId}
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
        htmlFor={priceId}
      >
        <div className={styles.label}>Price {valueIsMajor && 'exceeds'}</div>
        <input
          type="number"
          className={styles.input}
          value={fiatAmountInputValue}
          min={0}
          onChange={({ target: { value } }) => setFiatAmount(value)}
          placeholder="0"
          id={priceId}
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
        <Icon name="wallet" /> {stringToValue(pairWalletAmount.toString(), 12)}{' '}
        {pairSlug}
      </span>
      <Range
        values={[percentage]}
        step={stepPrice}
        min={minPrice}
        max={maxPrice}
        onChange={([newValue]) => {
          setPercentage(newValue);

          const newFiatAmount = (pairWalletAmount / 100) * newValue;
          setFiatAmount(newFiatAmount.toString());

          setLastChange('FIAT');
        }}
        disabled={pairWalletAmount === 0}
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
      {isLimit && (
        <label
          className={cn(styles.field, { [styles.exceeded]: valueIsMajor })}
          htmlFor={expectedId}
        >
          <div className={styles.label}>Quote</div>
          <input
            type="number"
            className={styles.input}
            value={expectPriceInputValue}
            min={0}
            onChange={({ target: { value } }) => setExpectedPrice(value)}
            placeholder="0"
            id={expectedId}
            autoComplete="off"
          />
          <div className={styles.currency}>
            <span>{pairSlug}</span>
          </div>
        </label>
      )}
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
