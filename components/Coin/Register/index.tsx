import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Modal } from '../../Modal';
import { SelectExchange } from './Select/Exchange';
import { SelectPair } from './Select/Pair';

import { Exchange } from './types';

export const RegisterCoin = () => {
  const { query: searchParams, pathname, push } = useRouter();
  const modalVisible = useMemo(
    () => searchParams.register === 'true',
    [searchParams]
  );
  const handleClose = useCallback(() => {
    push({
      pathname,
      query: undefined,
    });
  }, []);

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
        />
      )}
    </Modal>
  );
};
