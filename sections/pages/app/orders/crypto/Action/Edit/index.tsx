import cn from 'classnames';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { getMinimumId } from '@helpers/GetMinimumId';
import { stringToValue } from '@helpers/StringToValue';
import { stringToNumber } from '@helpers/StringToNumber';

import { Modal } from '@components/Modal';
import { TextInput } from '@components/TextInput';

import { api } from '@services/api';

import { HandleChangeStatus, Item } from '../../types';

import styles from '../Action.module.scss';

interface Fields {
  amount: string;
  transactionHash: string;
}

interface EditProps {
  item: Item;
  handleClose: () => void;
  isSelectedEditItem: boolean;
  handleChangeItemStatus: HandleChangeStatus;
  fetchItems: () => void;
}
export const Edit = ({
  item,
  handleClose,
  isSelectedEditItem,
  handleChangeItemStatus,
  fetchItems,
}: EditProps) => {
  const { register, control, reset, watch } = useForm<Fields>({
    defaultValues: { amount: '' },
  });
  const amount = watch('amount');
  const transactionHash = watch('transactionHash');

  const [fetching, setFetching] = useState<boolean>(false);

  const handleEdit: (approve?: boolean) => Promise<void> = useCallback(
    async (approve = false) => {
      try {
        setFetching(true);

        const amountRequest = stringToNumber(amount) || undefined;
        const transactionHashRequest = transactionHash || undefined;

        await api.put(`/api/crypto/deposit`, {
          amount: amountRequest,
          transactionHash: transactionHashRequest,
          depositUid: item.uid,
        });

        if (approve) {
          await api.post(`/api/crypto/deposit/evaluate`, {
            depositIds: item.uid,
            approved: true,
          });

          handleChangeItemStatus('CONFIRMED', item.uid);
        }

        handleClose();
        fetchItems();
      } finally {
        setFetching(false);
      }
    },
    [
      handleChangeItemStatus,
      handleClose,
      item,
      amount,
      transactionHash,
      fetchItems,
    ]
  );

  const handleCloseModal = useCallback(() => {
    if (!fetching) {
      handleClose();
    }
  }, [handleClose, fetching]);

  useEffect(() => {
    if (!isSelectedEditItem) {
      reset();
    }
  }, [isSelectedEditItem]);

  return (
    <Modal visible={isSelectedEditItem} onClose={handleCloseModal}>
      <div className={styles.successfully} data-testid="content">
        <div className={cn('h2', styles.title)}>Edit</div>
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
              {getMinimumId(item.uid)}
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
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange: change, ...field } }) => (
                <TextInput
                  label="AMOUNT"
                  {...field}
                  onChange={({ target: { value } }) => {
                    const newValue = value ? stringToValue(value) : '';

                    change(newValue);
                  }}
                />
              )}
            />
          </div>
          <div className={styles.item}>
            <TextInput
              label="Transaction hash"
              {...register('transactionHash')}
            />
          </div>
        </div>
        <div className={styles.btns}>
          <button
            className={cn('button-stroke', styles.button)}
            type="button"
            onClick={() => handleEdit()}
            disabled={fetching}
            data-testid="cancel-button"
          >
            Save for later
          </button>
          <button
            className={cn('button-green', styles.button)}
            type="button"
            onClick={() => handleEdit(true)}
            disabled={fetching}
            data-testid="confirm-button"
          >
            Save and confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};
