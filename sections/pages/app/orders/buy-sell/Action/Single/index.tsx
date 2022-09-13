import cn from 'classnames';
import { format } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

import { getValue } from '@helpers/GetValue';

import { Modal } from '@components/Modal';

import { api } from '@services/api';

import { HandleChangeStatus, Item, Variant } from '../../types';

import styles from '../Action.module.scss';

interface SingleProps {
  item: Item;
  handleClose: () => void;
  isSelectedItem: boolean;
  handleChangeItemStatus: HandleChangeStatus;
  variant: Variant;
}
export const Single = ({
  item,
  handleClose,
  isSelectedItem,
  handleChangeItemStatus,
  variant,
}: SingleProps) => {
  const [fetching, setFetching] = useState<boolean>(false);

  const lowecaseVariant = useMemo(() => variant.toLowerCase(), [variant]);

  const handleConfirm = useCallback(async () => {
    try {
      setFetching(true);

      await api.put(`/api/order/evaluate`, {
        orderIds: item.id,
        approved: variant === 'APPROVE',
      });

      handleChangeItemStatus(
        variant === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        item.id
      );
      handleClose();
    } finally {
      setFetching(false);
    }
  }, [handleChangeItemStatus, handleClose, item, variant]);

  const handleCloseModal = useCallback(() => {
    if (!fetching) {
      handleClose();
    }
  }, [handleClose, fetching]);

  return (
    <Modal visible={isSelectedItem} onClose={handleCloseModal}>
      <div className={styles.successfully} data-testid="content">
        <div className={cn('h2', styles.title)}>{lowecaseVariant}</div>
        <div className={cn(styles.info, styles[lowecaseVariant])}>
          Are you sure you want to <span data-testid="variant">{variant}</span>{' '}
          the transaction?
        </div>
        <div className={styles.list}>
          <div className={styles.item}>
            <div className={styles.category}>User</div>
            <div className={styles.content} data-testid="user-name">
              {item.user.name}
            </div>
            <div className={styles.subcontent} data-testid="user-email">
              {item.user.email}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.category}>Currency</div>
            <div className={styles.content} data-testid="currency-code">
              {item.pair.name}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.category}>Quantity</div>
            <div className={styles.content} data-testid="quantity">
              {`${getValue(item.quantity)} ${item.pair.name.split('/')[0]}`}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.category}>Trade value</div>
            <div className={styles.content}>{getValue(item.total)} USD</div>
          </div>
          <div className={styles.item}>
            <div className={styles.category}>Date</div>
            <div className={styles.content}>
              {format(item.date, 'dd-MM-yyyy')}
            </div>
            <div className={styles.subcontent}>
              {format(new Date(item.date), 'HH:mm:ss')}
            </div>
          </div>
        </div>
        <div className={styles.btns}>
          <button
            className={cn('button-stroke', styles.button)}
            type="button"
            onClick={handleClose}
            disabled={fetching}
            data-testid="cancel-button"
          >
            No
          </button>
          <button
            className={cn('button', styles.button)}
            type="button"
            onClick={handleConfirm}
            disabled={fetching}
            data-testid="confirm-button"
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>
  );
};
