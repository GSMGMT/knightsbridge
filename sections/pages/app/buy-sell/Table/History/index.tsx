import cn from 'classnames';
import { format } from 'date-fns';

import { getValue } from '@helpers/GetValue';

import styles from '../Table.module.scss';

import { GeneralSortingProps, Sorting } from '../Sorting';
import { Order } from '../types';

interface HistoryTableProps extends GeneralSortingProps {
  orders: Array<Order>;
}
export const HistoryTable = ({ orders, ...sorting }: HistoryTableProps) => (
  <div className={styles.table}>
    <div className={styles.row}>
      <div className={styles.col}>
        <Sorting {...sorting} sortBy="type">
          Type
        </Sorting>
      </div>
      <div className={styles.col}>
        <Sorting {...sorting} sortBy="createdAt">
          Date/Time
        </Sorting>
      </div>
      <div className={styles.col}>
        <div>Asset</div>
      </div>
      <div className={styles.col}>
        <Sorting {...sorting} sortBy="price">
          Price (USD)
        </Sorting>
      </div>
      <div className={styles.col}>
        <Sorting {...sorting} sortBy="amount">
          Amount
        </Sorting>
      </div>
      <div className={styles.col}>
        <Sorting {...sorting} sortBy="total">
          Total (USD)
        </Sorting>
      </div>
      <div className={styles.col}>
        <Sorting {...sorting} sortBy="status">
          Status
        </Sorting>
      </div>
    </div>
    {orders.map((transaction, index) => {
      const status = transaction.status.toLowerCase();
      const variant = transaction.type.toLowerCase();

      return (
        <div
          className={cn(
            styles.row,
            styles.history,
            styles[variant],
            styles[status]
          )}
          key={index}
        >
          <div className={styles.col}>{transaction.type}</div>
          <div className={styles.col}>
            {format(transaction.createdAt, 'dd-MM-yyyy HH:mm:ss')}
          </div>
          <div className={styles.col}>{transaction.asset}</div>
          <div className={cn(styles.col, styles.price)}>
            {getValue(transaction.price)}
          </div>
          <div className={styles.col}>{getValue(transaction.amount)}</div>
          <div className={styles.col}>{getValue(transaction.total)}</div>
          <div className={styles.col}>{status}</div>
        </div>
      );
    })}
  </div>
);
