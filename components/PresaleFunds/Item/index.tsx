import cn from 'classnames';
import Image from 'next/image';

import styles from './Item.module.sass';

export interface ItemI {
  coinId: string;
  currency: string;
  name: string;
  currencyTotal: number;
  currencyAvailable: number;
  currencyOrder: number;
  quote: number;
  logo: string;
  type: 'FIAT' | 'SPOT';
}

interface ItemProps {
  item: ItemI;
}
export const Item = ({ item }: ItemProps) => (
  <div className={cn(styles.item)}>
    <div className={styles.row} role="button" tabIndex={-1}>
      <div className={styles.col}>
        <div className={styles.currency}>
          <div className={styles.icon}>
            <Image src={item.logo} alt="Currency" width={32} height={32} />
          </div>
          <div className={styles.details}>
            <div className={styles.info}>{item.currency}</div>
            <div className={styles.text}>{item.name}</div>
          </div>
        </div>
      </div>
      <div className={styles.col}>
        <div className={styles.info}>0.0358 USDT</div>
      </div>
      <div className={styles.col}>
        <div className={styles.info}>405.203</div>
        <div className={styles.text}>100.000.00</div>
      </div>
      <div className={styles.col}>
        <div className={styles.info}>0.2785689852 BTC</div>
        <div className={styles.text}>$10,098.36</div>
      </div>
    </div>
  </div>
);
