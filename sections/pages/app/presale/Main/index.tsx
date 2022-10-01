import { getValue } from '@helpers/GetValue';
import { api } from '@services/api';
import cn from 'classnames';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import styles from './Main.module.scss';

interface MainProps {
  balanceDollar: number;
}
export const Main: FunctionComponent<MainProps> = ({ balanceDollar }) => {
  const [usdtQuote, setUsdtQuote] = useState<number>(1);

  useEffect(() => {
    (async () => {
      const {
        data: { data: price },
      } = await api.get<{
        data: number;
      }>('/api/currency/latest', {
        params: {
          id: 825,
        },
      });

      if (price) setUsdtQuote(price);
    })();
  }, []);

  const balanceUSDT = useMemo(
    () => balanceDollar * usdtQuote,
    [usdtQuote, balanceDollar]
  );

  return (
    <div className={styles.main}>
      <h4 className={cn('h4', styles.title)}>Presale</h4>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.info}>Total balance</div>
          <div className={styles.currency}>
            <div className={styles.number}>{getValue(balanceUSDT)}</div>
            <div className={cn('category-green', styles.category)}>USDT</div>
          </div>
          <div className={styles.price}>${getValue(balanceDollar)}</div>
        </div>
      </div>
    </div>
  );
};
