import { useCallback, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import cn from 'classnames';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import Image from 'next/image';

import { navigation } from '@navigation';

import { api } from '@services/api';

import { TextInput } from '@components/TextInput';
import { Icon } from '@components/Icon';
import { DepositInfo } from '@components/DepositInfo';
import { Link } from '@components/Link';

import { Coin, Address } from '../types';
import { DepositInfo as IDepositInfo, Successfully } from '../Successfully';

import styles from './ConfirmDeposit.module.scss';

const schema = yup.object().shape({
  hash: yup.string().required('Please, inform the hash of the transaction'),
});
interface Fields {
  hash: string;
}

interface ConfirmDepositProps {
  goNext: () => void;
  goBack: () => void;
  coinSelected: Coin;
  networkSelected: Address;
  amount: number;
}
export const ConfirmDeposit = ({
  goBack,
  amount,
  coinSelected,
  networkSelected,
}: ConfirmDepositProps) => {
  const {
    register,
    formState,
    handleSubmit: submit,
    watch,
    setError,
  } = useForm<Fields>({
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const { push: navigate } = useRouter();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const handleCloseModal = useCallback(() => {
    navigate(navigation.app.wallet);
  }, [navigate]);

  const [fetching, setFetching] = useState<boolean>(false);
  const canSubmit = useMemo(
    () => !formState.errors.hash && !modalVisible,
    [formState]
  );

  const hash = watch('hash');
  const [transactionId, setTransactionId] = useState<string>('');
  const depositInfo: IDepositInfo = useMemo(
    () => ({ hash, uid: transactionId } as IDepositInfo),
    [transactionId]
  );

  const handleSubmit = useCallback(
    submit(async () => {
      if (!canSubmit) return;

      setFetching(true);

      try {
        const {
          data: {
            data: { uid },
          },
        } = await api.post<{ data: { uid: string } }>('/api/crypto/deposit', {
          amount,
          cryptoId: coinSelected.uid,
          addressId: networkSelected.uid,
          transactionHash: hash,
        });

        setTransactionId(uid);
        setModalVisible(true);
      } catch (errorHandler: any) {
        if (axios.isAxiosError(errorHandler)) {
          const error = errorHandler as AxiosError<{ message: string }>;

          const { message } = error.response!.data;

          setError('hash', { message });
        }
      } finally {
        setFetching(false);
      }
    }),
    [hash, coinSelected, networkSelected, canSubmit, amount]
  );

  return (
    <>
      <form className={styles.item} onSubmit={handleSubmit}>
        <div className={styles.control}>
          <button className={styles.back} onClick={goBack} type="button">
            <Icon name="arrow-prev" size={14} />
            Confirm deposit
          </button>
          <div className={styles.money}>
            Depositing {coinSelected.name}
            <span className={styles.coin}>
              <Image
                src={coinSelected.logo}
                alt={coinSelected.name}
                width={24}
                height={24}
              />
            </span>
          </div>
        </div>

        <DepositInfo
          amount={amount}
          coin={coinSelected}
          networkAddress={networkSelected}
        />

        <TextInput
          className={styles.hash}
          label="TRANSACTION HASH"
          variant={errors.hash?.message ? 'error' : undefined}
          note={errors.hash?.message}
          {...register('hash')}
        />

        <div className={styles.btns}>
          <Link
            className={cn('button', 'button-stroke', styles.button)}
            href={navigation.app.wallet}
          >
            Cancel
          </Link>
          <button
            className={cn('button', styles.button)}
            type="submit"
            disabled={!canSubmit}
          >
            {modalVisible ? 'Confirmed' : fetching ? 'Confirming' : 'Confirm'}{' '}
            deposit request
          </button>
        </div>
      </form>
      <Successfully
        amount={amount}
        coin={coinSelected}
        walletAddress={networkSelected}
        handleClose={handleCloseModal}
        visible={modalVisible}
        depositInfo={depositInfo}
      />
    </>
  );
};
