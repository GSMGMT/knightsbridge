import { useCallback, useEffect, useMemo, useState } from 'react';

import styles from '@styles/pages/app/wallet/Wallet.module.sass';

import { Main } from '@sections/pages/app/wallet/Main';
import { Funds } from '@components/Funds';
import { ItemI } from '@components/Funds/Item';

import { useTitle } from '@hooks/Title';

import { api } from '@services/api';

const FiatSpot = () => {
  useTitle('Fiat and Spot');

  const [fiatItems, setFiatItems] = useState<Array<ItemI>>([]);
  const [spotItems, setSpotItems] = useState<Array<ItemI>>([]);

  const items = useMemo(
    () => [...fiatItems, ...spotItems],
    [fiatItems, spotItems]
  );

  const handleFetchPortfolio: () => Promise<void> = useCallback(async () => {
    const {
      data: {
        data: { assets: fiat },
      },
    } = await api.get<{
      data: {
        total: number;
        assets: Array<{
          name: string;
          code: string;
          quote: number;
          amount: number;
          available: number;
          logo: string;
          id: string;
        }>;
      };
    }>('/api/fiat/portfolio');
    const newFiatItems = fiat.map(
      ({ code, name, quote, amount, logo, available, id }) => {
        const currencyOrder = amount - available;

        return {
          coinId: id,
          currency: code,
          name,
          quote,
          currencyTotal: amount,
          currencyAvailable: available,
          currencyOrder,
          logo,
          type: 'FIAT',
        } as ItemI;
      }
    );
    setFiatItems([...newFiatItems]);

    const {
      data: {
        data: { currencies: crypto },
      },
    } = await api.get<{
      data: {
        total: number;
        currencies: Array<{
          name: string;
          code: string;
          quote: number;
          amount: number;
          available: number;
          logo: string;
          id: string;
        }>;
      };
    }>('/api/crypto/portfolio');
    const newSpotItems = crypto.map(
      ({ code, name, quote, amount, logo, available, id }) => {
        const currencyOrder = amount - available;

        return {
          coinId: id,
          currency: code,
          name,
          quote,
          currencyTotal: amount,
          currencyAvailable: available,
          currencyOrder,
          logo,
          type: 'SPOT',
        } as ItemI;
      }
    );
    setSpotItems([...newSpotItems]);
  }, []);
  useEffect(() => {
    handleFetchPortfolio();
  }, []);

  const fiatAmount = useMemo(() => {
    const itemsInDollar = fiatItems.map(
      ({ currencyTotal, quote }) => currencyTotal * quote
    );

    const value = itemsInDollar.reduce((prev, curr) => prev + curr, 0);

    return value;
  }, [fiatItems]);
  const cryptoAmount = useMemo(() => {
    const itemsInDollar = spotItems.map(
      ({ currencyTotal, quote }) => currencyTotal * quote
    );

    const value = itemsInDollar.reduce((prev, curr) => prev + curr, 0);

    return value;
  }, [spotItems]);

  return (
    <div>
      <Main fiatAmount={fiatAmount} cryptoAmount={cryptoAmount} />
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.head}>Funds</div>
          <div className={styles.body}>
            <Funds items={items} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default FiatSpot;
