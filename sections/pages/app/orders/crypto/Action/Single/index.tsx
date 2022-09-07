import cn from 'classnames';
import { format } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

import { getMinimumId } from '@helpers/GetMinimumId';

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

      await api.put(`/api/crypto/deposit/approve`, {
        id: item.id,
        approved: variant === 'CONFIRM',
      });

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
        <div className={cn('h2', styles.title)}>{lowecaseVariant}</div>
        <div className={cn(styles.info, styles[lowecaseVariant])}>
          Are you sure you want to <span data-testid="variant">{variant}</span>{' '}
          the deposit request <span>{getMinimumId(item.id)}</span>?
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
            <div className={styles.category}>Transaction ID</div>
            <div className={styles.content} data-testid="user-name">
              {getMinimumId(item.id)}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.category}>Date</div>
            <div className={styles.content} data-testid="user-name">
              {format(item.date, 'dd-MM-yyyy')}
            </div>
            <div className={styles.subcontent} data-testid="user-email">
              {format(item.date, 'HH:mm:ss')}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.category}>Deposit Crypto</div>
            <div className={styles.content} data-testid="user-name">
              {item.currency}
            </div>
            <div className={styles.subcontent} data-testid="user-email">
              BEP20
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.category}>Amount</div>
            <div className={styles.content} data-testid="currency-code">
              {item.amount}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.category}>Transaction hash</div>
            <div className={styles.content}>{item.transactionHash}</div>
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
