import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { navigation } from '@navigation';

import { Modal } from '@components/Modal';
import { SelectExchange } from './Select/Exchange';
import { SelectPair } from './Select/Pair';

import { Exchange } from './types';

interface RegisterCoinProps {
  fetchPairs: () => void;
}
export const RegisterCoin = ({ fetchPairs }: RegisterCoinProps) => {
  const { asPath: pathname, push } = useRouter();
  const modalVisible = useMemo(
    () => pathname === navigation.app.coin.register,
    [pathname]
  );
  const handleClose = useCallback(() => {
    push(navigation.app.coin.list);
  }, [pathname]);

  const [currentStage, setCurrentStage] = useState<'EXCHANGE' | 'PAIR'>(
    'EXCHANGE'
  );
  useEffect(() => {
    if (!modalVisible && currentStage !== 'EXCHANGE') {
      setCurrentStage('EXCHANGE');
    }
  }, [modalVisible]);

  const [currentExchange, setCurrentExchange] = useState<Exchange>({
    cmcId: '',
    name: '',
    logo: '',
  });
  const handleSelectExchange: (newExchange: Exchange) => void = useCallback(
    ({ ...newExchange }) => {
      setCurrentExchange({ ...newExchange });
      setCurrentStage('PAIR');
    },
    []
  );

  return (
    <Modal visible={modalVisible} onClose={handleClose}>
      {currentStage === 'EXCHANGE' && (
        <SelectExchange handleSelectExchange={handleSelectExchange} />
      )}
      {currentStage === 'PAIR' && (
        <SelectPair
          currentExchange={currentExchange}
          closeModal={handleClose}
          fetchPairs={fetchPairs}
        />
      )}
    </Modal>
  );
};
