import cn from 'classnames';
import { format } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

import { getValue } from '@helpers/GetValue';

import { Bulk } from '../Action/Bulk';
import { Single } from '../Action/Single';

import styles from '../Table.module.scss';

import { HandleCancelSingleOrder } from '..';
import { Order } from '../types';
import { GeneralSortingProps, Sorting } from '../Sorting';

interface OpenTableProps extends GeneralSortingProps {
  orders: Array<Order>;
  handleCancelAllOrders: () => void;
  handleCancelSingleOrder: HandleCancelSingleOrder;
}
export const OpenTable = ({
  orders,
  handleCancelAllOrders,
  handleCancelSingleOrder,
  ...sorting
}: OpenTableProps) => {
  const [isTriggeredBulk, setIsTriggeredBulk] = useState<boolean>(false);
  const handleToggleBulk = useCallback(
    () => setIsTriggeredBulk(!isTriggeredBulk),
    [isTriggeredBulk]
  );

  const ordersIds = useMemo(() => orders.map((order) => order.uid), [orders]);

  const [isTriggeredSingle, setIsTriggeredSingle] = useState<boolean>(false);
  const handleCloseTriggeredSingle = useCallback(() => {
    setIsTriggeredSingle(false);
  }, []);
  const [idOrderTriggeredSingle, setIdOrderTriggeredSingle] =
    useState<string>('');
  const handleToggleSingle: (orderId: string) => void = useCallback(
    (orderId) => {
      setIdOrderTriggeredSingle(orderId);
      setIsTriggeredSingle(true);
    },
    [isTriggeredSingle]
  );

  return (
    <>
      <div className={cn(styles.table, styles.open)}>
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
            <button type="button" onClick={handleToggleBulk}>
              Cancel All
            </button>
          </div>
        </div>

        {orders.map((order, index) => {
          const variant = order.type.toLowerCase();

          return (
            <div className={cn(styles.row, styles[variant])} key={index}>
              <div className={styles.col}>{order.type}</div>
              <div className={styles.col}>
                {format(order.createdAt, 'dd-MM-yyyy HH:mm:ss')}
              </div>
              <div className={styles.col}>{order.asset}</div>
              <div className={cn(styles.col, styles.price)}>
                {getValue(order.price)}
              </div>
              <div className={styles.col}>{getValue(order.amount)}</div>
              <div className={styles.col}>{getValue(order.total)}</div>
              <div className={styles.col}>
                <button
                  type="button"
                  onClick={() => handleToggleSingle(order.uid)}
                  disabled
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Bulk
        isTriggeredBulk={isTriggeredBulk}
        handleClose={handleToggleBulk}
        handleCancelAllOrders={handleCancelAllOrders}
        ordersIds={ordersIds}
      />
      <Single
        isTriggeredSingle={isTriggeredSingle}
        handleClose={handleCloseTriggeredSingle}
        handleCancelSingleOrder={handleCancelSingleOrder}
        orderId={idOrderTriggeredSingle}
      />
    </>
  );
};
