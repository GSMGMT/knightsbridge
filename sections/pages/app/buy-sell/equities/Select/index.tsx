import { useCallback, useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { ExchangeContext } from '@store/contexts/Exchange';

import { navigation } from '@navigation';

import { StockInfo, HandleNavigateStep } from './types';

import { Crypto } from './Crypto';
import { Pair } from './Pair';

export const Select = () => {
  const { pair: selectedPair } = useContext(ExchangeContext);
  const { push } = useRouter();

  const [coinInfo, setCoinInfo] = useState<StockInfo | null>(null);

  const handleCloseSelect = useCallback(() => {
    if (selectedPair) {
      push(navigation.app.buySell);
    } else {
      push(navigation.app.wallet);
    }
  }, []);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(1);
  const handleNextStep: HandleNavigateStep = useCallback(() => {
    setCurrentStepIndex(currentStepIndex + 1);
  }, [currentStepIndex]);
  const handlePreviousStep: HandleNavigateStep = useCallback(() => {
    setCurrentStepIndex(currentStepIndex - 1);
  }, [currentStepIndex]);

  return currentStepIndex === 1 ? (
    <Crypto
      handleNextStep={handleNextStep}
      setCoinInfo={setCoinInfo}
      handleCloseSelect={handleCloseSelect}
    />
  ) : (
    <Pair
      coinInfo={coinInfo!}
      handlePreviousStep={handlePreviousStep}
      handleCloseSelect={handleCloseSelect}
    />
  );
};
