import styles from './Funds.module.scss';

import { Item, ItemI } from './Item';

interface FundsProps {
  items: Array<ItemI>;
}
export const Funds = ({ items }: FundsProps) => (
  <div className={styles.wrap}>
    <div className={styles.list}>
      <div className={styles.row}>
        <div className={styles.col}>Asset</div>
        <div className={styles.col}>Price</div>
        <div className={styles.col}>Amount in sale</div>
        <div className={styles.col}>Total balance</div>
      </div>
      {items.map((item, index) => (
        <Item item={item} key={index} />
      ))}
    </div>
  </div>
);
