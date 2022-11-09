import cn from 'classnames';
import { format } from 'date-fns';

import { PresaleOrder } from '@contracts/presale/nft/PresaleOrder';

import styles from './Orders.module.scss';

type OrdersProps = {
  items: Array<PresaleOrder>;
};
export const Orders = ({ items }: OrdersProps) => (
  <div role="table" className={cn(styles.table)}>
    <div role="row" className={cn(styles.row, styles.grid)}>
      <div>Date/ID</div>
      <div>User/Email</div>
      <div>Quantity</div>
      <div>Total</div>
    </div>
    {items.map(
      ({
        createdAt,
        uid,
        user: { name, surname, email },
        nft: {
          quote,
          baseCurrency: { symbol },
        },
      }) => {
        const user = `${name} ${surname}`;

        return (
          <div tabIndex={-1} className={cn(styles.row)} key={uid} role="button">
            <div role="row" className={cn(styles.grid)}>
              <div>
                <div className={styles.label}>Date/ID</div>
                <div className={cn(styles.info, styles.column)}>
                  <div className={cn(styles.main)}>
                    {format(createdAt, 'dd/MM/yyyy')}{' '}
                    {format(createdAt, 'hh:mm:ss')}
                  </div>
                  <div className={cn(styles.detail, styles.limit)}>{uid}</div>
                </div>
              </div>
              <div>
                <div className={styles.label}>User/Email</div>
                <div className={cn(styles.info, styles.column)}>
                  <span className={cn(styles.main)}>{user}</span>
                  <div className={cn(styles.detail, styles.limit)}>{email}</div>
                </div>
              </div>
              <div>
                <div className={styles.label}>Quantity</div>
                <div className={cn(styles.info)}>1</div>
              </div>
              <div>
                <div className={styles.label}>Total</div>
                <div className={cn(styles.info)}>
                  {quote} {symbol}
                </div>
              </div>
            </div>
          </div>
        );
      }
    )}
  </div>
);
