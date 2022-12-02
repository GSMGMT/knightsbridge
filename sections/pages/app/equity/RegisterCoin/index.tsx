import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { navigation } from '@navigation';

import { Source, Stock } from '@contracts/Equity';

import { Modal } from '@components/Modal';
import { SelectSource } from './Select/Source';
import { SelectStock } from './Select/Stock';
import { Successfully } from './Successfully';

export const RegisterCoin = () => {
  const { asPath: pathname, push } = useRouter();
  const modalVisible = useMemo(
    () => pathname === navigation.app.equities.register,
    [pathname]
  );
  const handleClose = useCallback(() => {
    push(navigation.app.equities.list);
  }, [pathname]);

  const [currentStage, setCurrentStage] = useState<
    'SOURCE' | 'STOCK' | 'CONCLUDED'
  >('SOURCE');
  useEffect(() => {
    if (!modalVisible && currentStage !== 'SOURCE') {
      setCurrentStage('SOURCE');
    }
  }, [modalVisible]);

  const [currentSource, setCurrentSource] = useState<Source>({
    id: '',
    name: '',
  });
  const [currentStock, setCurrentStock] = useState<Stock>({
    id: '',
    name: '',
    symbol: '',
  });
  const handleSelectExchange: (newExchange: Source) => void = useCallback(
    ({ ...newExchange }) => {
      setCurrentSource({ ...newExchange });
      setCurrentStage('STOCK');
    },
    []
  );
  const handleSelectStock: (newStock: Stock) => void = useCallback(
    ({ ...newStock }) => {
      setCurrentStock({ ...newStock });
      setCurrentStage('CONCLUDED');
    },
    []
  );

  return (
    <Modal visible={modalVisible} onClose={handleClose}>
      {currentStage === 'SOURCE' && (
        <SelectSource handleSelectExchange={handleSelectExchange} />
      )}
      {currentStage === 'STOCK' && (
        <SelectStock
          currentSource={currentSource}
          handleSelectStock={handleSelectStock}
        />
      )}
      {currentStage === 'CONCLUDED' && (
        <Successfully
          sourceRegistered={currentSource}
          stockRegistered={currentStock}
        />
      )}
    </Modal>
  );
};
