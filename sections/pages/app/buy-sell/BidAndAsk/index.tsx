import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import cn from 'classnames';

import { getValue } from '@helpers/GetValue';

import { ExchangeContext } from '@store/contexts/Exchange';

import { BidAndAskListOrders } from '@libs/firebase/functions/order/bidAndAsk/listOrders';

import { api } from '@services/api';

import styles from './BidAndAsk.module.scss';

export const BidAndAsk = () => {
  const {
    pair,
    walletPortfolio: {
      base: { amount: baseWalletAmount },
      pair: { amount: pairWalletAmount },
    },
  } = useContext(ExchangeContext);
  const martketPair = useMemo(() => {
    const {
      base: { slug: baseSlug },
      pair: { slug: pairSlug },
    } = pair!;

    return `${baseSlug}/${pairSlug}`;
  }, [pair]);

  const [bidAndAsk, setBidAndAsk] = useState<BidAndAskListOrders>({
    buy: [],
    sell: [],
  });
  const buy = useMemo(() => bidAndAsk.buy, [bidAndAsk]);
  const sell = useMemo(() => bidAndAsk.sell, [bidAndAsk]);

  const fetchBidAndAsk = useCallback(async () => {
    const {
      data: { data },
    } = await api.get<{
      data: BidAndAskListOrders;
    }>('/api/order/bidask', {
      params: {
        martketPair: martketPair === 'FBX/USDT' ? 'FBX/USDT' : undefined,
      },
    });

    setBidAndAsk(data);
  }, [martketPair]);

  useInterval(fetchBidAndAsk, 1000 * 60 * 5);

  useEffect(() => {
    fetchBidAndAsk();
  }, [baseWalletAmount, pairWalletAmount]);

  return (
    <div className={styles.table}>
      <div className={cn(styles.item, styles.title)}>
        <span>Price</span>
        <span>Amounts</span>
        <span>Total</span>
      </div>
      <div className={styles.sections}>
        <div className={styles.section}>
          {sell.map(({ amount, price, total, uid }) => (
            <div className={cn(styles.item, styles.sell)} key={uid}>
              <span>{getValue(price)}</span>
              <span>{getValue(amount)}</span>
              <span>{getValue(total)}</span>
            </div>
          ))}
        </div>
        <div className={styles.section}>
          {buy.map(({ amount, price, total, uid }) => (
            <div className={cn(styles.item, styles.buy)} key={uid}>
              <span>{getValue(price)}</span>
              <span>{getValue(amount)}</span>
              <span>{getValue(total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
