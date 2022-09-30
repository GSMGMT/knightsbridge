import cn from 'classnames';

import styles from './Main.module.scss';

export const Main = () => (
  <div className={styles.main}>
    <h4 className={cn('h4', styles.title)}>Presale</h4>
    <div className={styles.list}>
      <div className={styles.item}>
        <div className={styles.info}>Total balance</div>
        <div className={styles.currency}>
          <div className={styles.number}>10,100.13</div>
          <div className={cn('category-green', styles.category)}>USDT</div>
        </div>
        <div className={styles.price}>$10,098.36</div>
      </div>
    </div>
  </div>
);
