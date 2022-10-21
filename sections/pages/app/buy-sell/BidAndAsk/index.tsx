import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import cn from 'classnames';

import { BidAndAskListOrders } from '@libs/firebase/functions/order/bidAndAsk/listOrders';

import { api } from '@services/api';

import { getValue } from '@helpers/GetValue';
import styles from './BidAndAsk.module.scss';

export const BidAndAsk = () => {
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
    }>('/api/order/bidask');

    setBidAndAsk(data);
  }, []);

  useInterval(fetchBidAndAsk, 1000 * 60 * 5);

  useEffect(() => {
    fetchBidAndAsk();
  }, [fetchBidAndAsk]);

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
