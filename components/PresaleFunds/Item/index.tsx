import cn from 'classnames';
import Image from 'next/image';

import { PresaleData } from '@services/api/presale/portfolio';

import { getValue } from '@helpers/GetValue';

import styles from './Item.module.sass';

interface ItemProps {
  item: PresaleData;
}
export const Item = ({ item }: ItemProps) => (
  <div className={cn(styles.item)}>
    <div className={styles.row}>
      <div className={styles.col}>
        <div className={styles.currency}>
          <div className={styles.icon}>
            <Image src={item.logo} alt="Currency" width={32} height={32} />
          </div>
          <div className={styles.details}>
            <div className={styles.info}>{item.code}</div>
            <div className={styles.text}>{item.name}</div>
          </div>
        </div>
      </div>
      <div className={styles.col}>
        <div className={styles.info}>
          {getValue(item.quote)} {item.baseCurrency}
        </div>
      </div>
      <div className={styles.col}>
        <div className={styles.info}>{getValue(item.amount)}</div>
      </div>
      <div className={styles.col}>
        <div className={styles.info}>
          {getValue(item.balance)} {item.code}
        </div>
        <div className={styles.text}>
          ${getValue(item.quote * item.price * item.balance)}
        </div>
      </div>
    </div>
  </div>
);
