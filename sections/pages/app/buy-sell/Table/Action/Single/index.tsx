import cn from 'classnames';
import { useCallback, useState } from 'react';

import { Modal } from '@components/Modal';
import { api } from '@services/api';

import { HandleCancelSingleOrder } from '../..';

import styles from '../Action.module.scss';

interface SingleProps {
  handleClose: () => void;
  isTriggeredSingle: boolean;
  orderId: string;
  handleCancelSingleOrder: HandleCancelSingleOrder;
}
export const Single = ({
  handleClose,
  isTriggeredSingle,
  orderId,
  handleCancelSingleOrder,
}: SingleProps) => {
  const [fetching, setFetching] = useState<boolean>(false);

  const handleConfirm = useCallback(async () => {
    try {
      setFetching(true);

      await api.put('/api/order/cancel', {
        orderIds: orderId,
      });

      handleCancelSingleOrder(orderId);

      handleClose();
    } finally {
      setFetching(false);
    }
  }, [handleClose, orderId, handleCancelSingleOrder]);

  const handleCloseModal = useCallback(() => {
    if (!fetching) {
      handleClose();
    }
  }, [handleClose, fetching]);

  return (
    <Modal visible={isTriggeredSingle} onClose={handleCloseModal}>
      <div className={styles.successfully}>
        <div className={cn('h2', styles.title)}>Cancel Order</div>
        <div className={cn(styles.info)}>
          Are you sure you want to <span>CANCEL</span> the order?
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
