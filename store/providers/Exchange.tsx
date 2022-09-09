import { useRouter } from 'next/router';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { PairSource } from '@services/api/app/fetchSources';

import { api } from '../../services/api';

import {
  ExchangeContext,
  HandleFetchWallet,
  IExchangeContext,
  Portfolio,
  HandleSelectPair,
} from '../contexts/Exchange';

interface ExchangeProviderProps {
  children: ReactNode;
}
export const ExchangeProvider = ({ children }: ExchangeProviderProps) => {
  const { push, pathname } = useRouter();

  const [pair, setPair] = useState<PairSource | undefined>(undefined);
  useEffect(() => {
    if (!pair) {
      push({ pathname, query: { select: 'true' } });
    }
  }, [pair]);

  const handleSelectPair: HandleSelectPair = useCallback((newPair) => {
    setPair(newPair);
  }, []);

  const [baseWalletAmount, setBaseWalletAmount] = useState<number>(0);
  const [pairWalletAmount, setPairWalletAmount] = useState<number>(0);

  const walletPortfolio: Portfolio = useMemo(
    () => ({
      base: {
        amount: baseWalletAmount,
      },
      pair: {
        amount: pairWalletAmount,
      },
    }),
    [baseWalletAmount, pairWalletAmount]
  );

  const handleFetchBaseCurrencyWallet: HandleFetchWallet =
    useCallback(async () => {
      const {
        base: { id },
      } = pair!;

      const {
        data: { data: amount },
      } = await api.get<{ data: number }>(`/api/currency/${id}/balance`);

      setBaseWalletAmount(amount);
    }, [pair]);
  const handleFetchPairCurrencyWallet: HandleFetchWallet =
    useCallback(async () => {
      const {
        pair: { id },
      } = pair!;

      const {
        data: { data: amount },
      } = await api.get<{ data: number }>(`/api/currency/${id}/balance`);

      setPairWalletAmount(amount);
    }, [pair]);

  const value = useMemo<IExchangeContext>(
    () =>
      ({
        pair,
        handleSelectPair,
        walletPortfolio,
        handleFetchBaseCurrencyWallet,
        handleFetchPairCurrencyWallet,
      } as IExchangeContext),
    [
      pair,
      handleSelectPair,
      walletPortfolio,
      handleFetchBaseCurrencyWallet,
      handleFetchPairCurrencyWallet,
    ]
  );

  return (
    <ExchangeContext.Provider value={value}>
      {children}
    </ExchangeContext.Provider>
  );
};
