import { Controller, useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';

import {
  WalletAddress,
  Coin as PairedCoin,
} from '@services/api/app/fetchCoins';
import { api } from '@services/api';

import { stringToValue } from '@helpers/StringToValue';
import { stringToNumber } from '@helpers/StringToNumber';

import { Modal } from '@components/Modal';
import { TextInput } from '@components/TextInput';
import { DepositInfo } from '@components/DepositInfo';

import styles from './DepositCrypto.module.scss';

type Coin = Pick<PairedCoin, 'uid' | 'logo' | 'name' | 'symbol' | 'price'>;

const schema = yup.object().shape({
  amount: yup
    .string()
    .required('Amount is required')
    .test(
      'amount',
      'Amount must be major than 0',
      (value = '') => stringToNumber(value) > 0
    ),
  hash: yup.string().required('Hash is required'),
});
interface Fields {
  amount: string;
  hash: string;
}

interface DepositCryptoProps {
  visible: boolean;
  onClose: () => void;
  selectedCoin: Coin;
  selectedAddressNetwork: WalletAddress;
}
export const DepositCrypto = ({
  onClose,
  visible,
  selectedAddressNetwork,
  selectedCoin,
}: DepositCryptoProps) => {
  const {
    control,
    watch,
    register,
    handleSubmit: submit,
    reset,
    formState,
    setValue,
  } = useForm<Fields>({
    defaultValues: { amount: '0' },
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const { errors } = formState;

  const amount = watch('amount');
  const amountValue = useMemo(() => stringToNumber(amount), [amount]);

  const [infoVisible, setInfoVisible] = useState<boolean>(false);

  const [fetching, setFetching] = useState<boolean>(false);
  const [fetched, setFetched] = useState<boolean>(false);

  useEffect(() => {
    if (fetched) {
      setTimeout(() => {
        onClose();

        setFetched(false);
      }, 3000);
    }
  }, [fetched, onClose]);

  const canSubmit = useMemo(
    () => !fetching && !fetched && infoVisible,
    [fetching, fetched, infoVisible]
  );
  const handleSubmit = useCallback(
    submit(async ({ hash }) => {
      if (fetched || fetching || !canSubmit) return;

      setFetching(true);

      try {
        await api.post<{ data: { id: string } }>('/api/crypto/deposit', {
          cryptoId: selectedCoin.uid,
          transactionHash: hash,
          amount: amountValue,
        });

        setFetched(true);
      } finally {
        setFetching(false);
      }
    }),
    [amountValue, infoVisible, fetching, fetched, selectedCoin, canSubmit]
  );

  useEffect(() => {
    if (!visible) {
      reset();
      setInfoVisible(false);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onClose={() => {
        if (fetching || fetched) return;

        onClose();
      }}
      title={`Deposit ${selectedCoin?.symbol}`}
    >
      <form
        className={styles.content}
        onSubmit={(event) => {
          event.preventDefault();

          if (!infoVisible) {
            if (amountValue > 0) {
              setInfoVisible(true);
            } else {
              setValue('amount', '0', { shouldValidate: true });
            }
          } else {
            handleSubmit(event);
          }
        }}
      >
        <Controller
          control={control}
          name="amount"
          render={({
            field: { onChange: change, ...field },
            formState: {
              errors: { amount: amountErrors },
            },
          }) => (
            <TextInput
              {...field}
              onChange={({ target: { value } }) => change(stringToValue(value))}
              autoComplete="off"
              label="Amount to deposit"
              variant={amountErrors ? 'error' : undefined}
              note={amountErrors?.message}
            />
          )}
        />
        {infoVisible && (
          <>
            <DepositInfo
              coin={selectedCoin}
              amount={amountValue}
              networkAddress={selectedAddressNetwork}
            />
            <TextInput
              {...register('hash')}
              label="TRANSACTION HASH"
              variant={errors.hash ? 'error' : undefined}
              note={errors.hash?.message}
            />
          </>
        )}
        <button
          type="submit"
          className={cn('button')}
          disabled={fetched || fetching}
        >
          {!infoVisible
            ? 'Confirm'
            : fetching
            ? 'Confirming deposit request...'
            : fetched
            ? 'Deposit requested'
            : 'Confirm deposit request'}
        </button>
      </form>
    </Modal>
  );
};
