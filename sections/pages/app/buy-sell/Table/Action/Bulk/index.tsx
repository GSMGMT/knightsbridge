import cn from 'classnames';
import { useCallback, useState } from 'react';

import { Modal } from '@components/Modal';

import { api } from '@services/api';

import styles from '../Action.module.scss';

interface BulkProps {
  handleClose: () => void;
  isTriggeredBulk: boolean;
  handleCancelAllOrders: () => void;
  ordersIds: Array<string>;
}
export const Bulk = ({
  handleClose,
  isTriggeredBulk,
  handleCancelAllOrders,
  ordersIds,
}: BulkProps) => {
  const [fetching, setFetching] = useState<boolean>(false);

  const handleConfirm = useCallback(async () => {
    try {
      setFetching(true);

      await api.put('/api/order/cancel', {
        multiple: true,
        orderIds: ordersIds,
      });

      handleCancelAllOrders();

      handleClose();
    } finally {
      setFetching(false);
    }
  }, [handleClose, handleCancelAllOrders, ordersIds]);

  const handleCloseModal = useCallback(() => {
    if (!fetching) {
      handleClose();
    }
  }, [handleClose, fetching]);

  return (
    <Modal visible={isTriggeredBulk} onClose={handleCloseModal}>
      <div className={styles.successfully}>
        <div className={cn('h2', styles.title)}>Cancel All</div>
        <div className={cn(styles.info)}>
          Are you sure you want to <span>CANCEL</span> all the orders?
        </div>
        <div className={styles.btns}>
          <button
            className={cn('button-stroke', styles.button)}
            type="button"
            onClick={handleCloseModal}
            disabled={fetching}
          >
            No
          </button>
          <button
            className={cn('button-red', styles.button)}
            type="button"
            onClick={handleConfirm}
            disabled={fetching}
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>
  );
};
