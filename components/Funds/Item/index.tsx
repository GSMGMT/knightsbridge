import { ReactNode, useCallback, useState } from 'react';
import cn from 'classnames';
import Image from 'next/image';

import { getValue } from '@helpers/GetValue';

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
  children: ReactNode;
}
export const Item = ({ item, children }: ItemProps) => {
  const [visible, setVisible] = useState(false);

  const getValueInDollar: (value: number) => string = useCallback(
    (value) => {
      const dollar = value * item.quote;

      return getValue(dollar, true);
    },
    [item]
  );

  const getValueWithCurrency: (value: number) => string = useCallback(
    (value) => {
      const valueWithCurrency = getValue(value);

      return `${valueWithCurrency} ${item.currency}`;
    },
    [item]
  );

  return (
    <div className={cn(styles.item, { [styles.active]: visible })}>
      <div
        className={styles.row}
        onClick={() => setVisible(!visible)}
        role="button"
        tabIndex={-1}
      >
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
          <div className={styles.info}>
            {getValueWithCurrency(item.currencyTotal)}
          </div>
          <div className={styles.text}>
            {getValueInDollar(item.currencyTotal)}
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.info}>
            {getValueWithCurrency(item.currencyAvailable)}
          </div>
          <div className={styles.text}>
            {getValueInDollar(item.currencyAvailable)}
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.info}>
            {getValueWithCurrency(item.currencyOrder)}
          </div>
          <div className={styles.text}>
            {getValueInDollar(item.currencyOrder)}
          </div>
        </div>
      </div>
      <div className={styles.btns}>{children}</div>
    </div>
  );
};
