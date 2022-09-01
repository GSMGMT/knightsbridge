import cn from 'classnames';
import { format } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

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

  const lowercaseVariant = useMemo(() => variant.toLowerCase(), [variant]);

  const handleConfirm = useCallback(async () => {
    try {
      setFetching(true);

      await api.put(
        `/api/admin/deposit/${item.id}?approved=${variant === 'CONFIRM'}`
      );

      handleChangeItemStatus(
        variant === 'CONFIRM' ? 'CONFIRMED' : 'REJECTED',
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
        <div className={cn('h2', styles.title)}>{lowercaseVariant}</div>
        <div className={cn(styles.info, styles[lowercaseVariant])}>
          Are you sure you want to <span data-testid="variant">{variant}</span>{' '}
          the deposit request{' '}
          <span data-testid="reference-number-title">
            {item.referenceIdentifier}
          </span>
          ?
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
            <div className={styles.category}>Reference N.</div>
            <div className={styles.content} data-testid="reference-number">
              {item.referenceIdentifier}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.category}>Currency</div>
            <div className={styles.content} data-testid="currency-code">
              {item.currency.code}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.category}>Quantity</div>
            <div className={styles.content} data-testid="quantity">
              {item.quantity}
            </div>
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
          <div className={styles.item}>
            <div className={styles.category}>Payment Method</div>
            <div className={styles.content}>Bank (SWIFT)</div>
            <div className={styles.subcontent}>Bangkok Bank</div>
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
