import { useCallback, useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { ExchangeContext } from '@store/contexts/Exchange';

import { navigation } from '@navigation';

import { CoinInfo, HandleNavigateStep } from './types';

import { Crypto } from './Crypto';
import { Pair } from './Pair';
import { Source } from './Source';

export const Select = () => {
  const { pair: selectedPair } = useContext(ExchangeContext);
  const { push } = useRouter();

  const [coinInfo, setCoinInfo] = useState<CoinInfo | null>(null);
  const coinLogo = useMemo(() => coinInfo?.logo || '', [coinInfo]);
  const [pair, setPair] = useState<string | null>(null);

  const handleCloseSelect = useCallback(() => {
    if (selectedPair) {
      push(navigation.app.buySell);
    } else {
      push(navigation.app.wallet);
    }
  }, [pair]);

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
  ) : currentStepIndex === 2 ? (
    <Pair
      coinInfo={coinInfo!}
      setPair={setPair}
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
      handleCloseSelect={handleCloseSelect}
    />
  ) : (
    <Source
      coinLogo={coinLogo}
      handlePreviousStep={handlePreviousStep}
      handleCloseSelect={handleCloseSelect}
      pair={pair!}
    />
  );
};
