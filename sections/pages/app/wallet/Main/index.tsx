import cn from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getValue } from '@helpers/GetValue';

import { api } from '@services/api';

import styles from './Main.module.scss';

interface MainProps {
  fiatAmount: number;
  cryptoAmount: number;
}
export const Main = ({ fiatAmount, cryptoAmount }: MainProps) => {
  const [bitcoinQuote, setBitcoinQuote] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const {
        data: {
          data: [
            {
              quote: { price: quote },
            },
          ],
        },
      } = await api.get<{
        data: Array<{
          quote: {
            price: number;
          };
        }>;
      }>('/api/data-analytics/coin-market/quotes/latest', {
        params: { id: 1 },
      });

      setBitcoinQuote(quote);
    })();
  }, []);

  const getValueWithDollar: (value: number) => string = useCallback((value) => {
    const valueWithDollar = getValue(value);

    return `$${valueWithDollar}`;
  }, []);

  const getValueForCrypto: (value: number) => string = useCallback(
    (value) => {
      const conversionValue = value / bitcoinQuote || 0;

      const valueForCrypto = getValue(conversionValue);

      return valueForCrypto;
    },
    [bitcoinQuote]
  );

  const generalAmount = useMemo(
    () => fiatAmount + cryptoAmount,
    [fiatAmount, cryptoAmount]
  );

  return (
    <div className={styles.main}>
      <h4 className={cn('h4', styles.title)}>Fiat and Spot</h4>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.info}>Fiat and Spot balance</div>
          <div className={styles.currency}>
            <div className={styles.number}>
              {getValueWithDollar(generalAmount)}
            </div>
            <div className={cn('category-green', styles.category)}>USD</div>
          </div>
          <div className={styles.price}>
            {getValueForCrypto(generalAmount)} BTC
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.info}>Spot balance</div>
          <div className={styles.currency}>
            <div className={styles.number}>
              {getValueWithDollar(cryptoAmount)}
            </div>
            <div className={cn('category-green', styles.category)}>USD</div>
          </div>
          <div className={styles.price}>
            {getValueForCrypto(cryptoAmount)} BTC
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.info}>Fiat balance</div>
          <div className={styles.currency}>
            <div className={styles.number}>
              {getValueWithDollar(fiatAmount)}
            </div>
            <div className={cn('category-green', styles.category)}>USD</div>
          </div>
          <div className={styles.price}>
            {getValueForCrypto(fiatAmount)} BTC
          </div>
        </div>
      </div>
    </div>
  );
};
