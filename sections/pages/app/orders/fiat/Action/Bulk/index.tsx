import cn from 'classnames';
import { useCallback, useMemo, useState } from 'react';

import { Modal } from '@components/Modal';

import { api } from '@services/api';

import { HandleChangeStatus, Variant } from '../../types';

import styles from '../Action.module.scss';

interface BulkProps {
  selectedItems: Array<string>;
  handleClose: () => void;
  isTriggeredBulk: boolean;
  handleChangeItemStatus: HandleChangeStatus;
  variant: Variant;
}
export const Bulk = ({
  selectedItems,
  handleClose,
  isTriggeredBulk,
  handleChangeItemStatus,
  variant,
}: BulkProps) => {
  const [fetching, setFetching] = useState<boolean>(false);

  const lowecaseVariant = useMemo(() => variant.toLowerCase(), [variant]);

  const handleConfirm = useCallback(async () => {
    try {
      setFetching(true);

      const {
        data: { data },
      } = await api.post('/api/fiat/deposit/evaluate', {
        depositIds: selectedItems,
        approved: variant === 'CONFIRM',
      });

      const itemsAvailableToChange = data
        .filter((item: { success: boolean }) => item.success)
        .map((item: { depositId: string }) => item.depositId);

      handleChangeItemStatus(
        variant === 'CONFIRM' ? 'CONFIRMED' : 'REJECTED',
        ...itemsAvailableToChange
      );
      handleClose();
    } finally {
      setFetching(false);
    }
  }, [handleChangeItemStatus, handleClose, selectedItems, variant]);

  const handleCloseModal = useCallback(() => {
    if (!fetching) {
      handleClose();
    }
  }, [handleClose, fetching]);

  return (
    <Modal visible={isTriggeredBulk} onClose={handleCloseModal}>
      <div className={styles.successfully}>
        <div className={cn('h2', styles.title)}>{lowecaseVariant}</div>
        <div className={cn(styles.info, styles[lowecaseVariant])}>
          Are you sure you want to <span>{variant}</span> all the deposits
          selected?
        </div>
        <div className={styles.btns}>
          <button
            className={cn('button-stroke', styles.button)}
            type="button"
            onClick={handleClose}
            disabled={fetching}
          >
            No
          </button>
          <button
            className={cn('button', styles.button)}
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
