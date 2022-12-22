import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { navigation } from '@navigation';

import { Exchange, Ticker } from '@contracts/MarketStack';

import { Modal } from '@components/Modal';
import { SelectSource } from './Select/Source';
import { SelectStock } from './Select/Stock';
import { Successfully } from './Successfully';

export const RegisterEquity = () => {
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

  const [currentSource, setCurrentSource] = useState<Exchange>({
    acronym: '',
    city: '',
    country: '',
    country_code: '',
    mic: '',
    name: '',
    website: '',
    currency: {
      name: '',
      symbol: '',
    },
    timezone: {
      abbr: '',
      abbr_dst: '',
      timezone: '',
    },
  });
  const [currentStock, setCurrentStock] = useState<Ticker>({
    country: '',
    has_eod: false,
    has_intraday: false,
    name: '',
    symbol: '',
    stock_exchange: {
      acronym: '',
      city: '',
      country: '',
      country_code: '',
      mic: '',
      name: '',
      website: '',
    },
  });
  const handleSelectExchange: (newExchange: Exchange) => void = useCallback(
    ({ ...newExchange }) => {
      setCurrentSource({ ...newExchange });
      setCurrentStage('STOCK');
    },
    []
  );
  const handleSelectStock: (newStock: Ticker) => void = useCallback(
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
