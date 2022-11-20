import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import cn from 'classnames';

import { getValue } from '@helpers/GetValue';

import { ExchangeContext } from '@store/contexts/Exchange';

import { Icon, Icons } from '@components/Icon';

import { api } from '@services/api';

import { navigation } from '@navigation';

import styles from './Main.module.scss';

interface Item {
  title: string;
  icon: Icons;
  quote: {
    value: number;
    percentage: number;
  };
}

export const Main = () => {
  const { push } = useRouter();
  const handleOpenSelectModal = useCallback(() => {
    push(`${navigation.app.buySell}/?select=true`);
  }, []);

  const {
    pair,
    walletPortfolio: {
      base: { amount },
    },
  } = useContext(ExchangeContext);
  const {
    usdQuote,
    base: { slug: baseSlug, cmcId: baseCmcId },
    pair: { slug: pairSlug, cmcId: pairCmcId },
  } = pair!;
  const [percentageChange, setPercentageChange] = useState<number>(0);

  const [fetching, setFetching] = useState<boolean>(false);

  const [items, setItems] = useState<Array<Item>>([]);
  useEffect(() => {
    (async () => {
      setFetching(true);

      const requestedCmcId = baseCmcId || pairCmcId;

      const {
        data: {
          data: [
            {
              quote: { price24h, volume24h },
            },
          ],
        },
      } = await api.get<{
        data: [
          {
            quote: {
              volume24h: {
                value: number;
                percentage: number;
              };
              price24h: {
                value: number;
                percentage: number;
              };
            };
          }
        ];
      }>('/api/data-analytics/coin-market/quotes/latest', {
        params: {
          id: requestedCmcId,
        },
      });

      const itemPrice24h: Item = {
        icon: 'clock',
        title: '24h change',
        quote: { ...price24h },
      };
      const itemVolume24h: Item = {
        icon: 'chart',
        title: '24h volume',
        quote: { ...volume24h },
      };

      setPercentageChange(itemPrice24h.quote.percentage);

      setItems([itemPrice24h, itemVolume24h]);

      setFetching(false);
    })();
  }, [baseCmcId, pairCmcId]);

  return (
    <div className={styles.main}>
      <div className={styles.details}>
        <div className={styles.box}>
          <div className={styles.line}>
            <div className={styles.info}>
              {baseSlug}/{pairSlug}
            </div>
          </div>
        </div>
        <div className={styles.box}>
          <div
            className={cn(styles.price, {
              [styles.positive]: percentageChange > 0,
              [styles.negative]: percentageChange < 0,
            })}
          >
            {getValue(usdQuote)}
          </div>
          <div className={styles.content}>
            <Icon name="coin" size={16} /> {getValue(amount)}
          </div>
        </div>
      </div>
      <button
        type="button"
        className={styles.select}
        onClick={handleOpenSelectModal}
      >
        <Icon name="arrow-down" size={24} />
      </button>
      <div className={cn(styles.list, fetching && 'fetching')}>
        {items.map((x, index) => (
          <div className={styles.item} key={index}>
            <div className={styles.subtitle}>
              <Icon name={x.icon} size={16} />
              {x.title}
            </div>
            <div className={styles.content}>
              {getValue(x.quote.value)}
              <span
                className={cn(styles.percentage, {
                  [styles.positive]: x.quote.percentage > 0,
                  [styles.negative]: x.quote.percentage < 0,
                })}
              >
                {getValue(x.quote.percentage)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
