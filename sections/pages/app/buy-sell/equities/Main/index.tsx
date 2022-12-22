import { useRouter } from 'next/router';
import { useCallback, useContext } from 'react';
import cn from 'classnames';

import { getValue } from '@helpers/GetValue';

import { EquitiesContext } from '@store/contexts/Equities';

import { Icon } from '@components/Icon';

import { navigation } from '@navigation';

import styles from './Main.module.scss';

export const Main = () => {
  const { push } = useRouter();
  const handleOpenSelectModal = useCallback(() => {
    push(`${navigation.app.equities.trade}/?select=true`);
  }, []);

  const {
    pair,
    walletPortfolio: {
      stock: { amount },
    },
  } = useContext(EquitiesContext);
  const {
    stock: { symbol: stockSlug },
    crypto: { symbol: cryptoSlug },
    price,
  } = pair!;

  return (
    <div className={styles.main}>
      <div className={styles.details}>
        <div className={styles.box}>
          <div className={styles.line}>
            <div className={styles.info}>
              {stockSlug}/{cryptoSlug}
            </div>
          </div>
        </div>
        <div className={styles.box}>
          <div className={cn(styles.price)}>{getValue(price)}</div>
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
    </div>
  );
};
