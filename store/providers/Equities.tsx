import { useRouter } from 'next/router';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { StockPair } from '@contracts/StockPair';

import { api } from '../../services/api';

import {
  EquitiesContext,
  HandleFetchWallet,
  IEquitiesContext,
  Portfolio,
  HandleSelectPair,
} from '../contexts/Equities';

interface EquitiesProviderProps {
  children: ReactNode;
}
export const EquitiesProvider = ({ children }: EquitiesProviderProps) => {
  const { push, pathname } = useRouter();

  const [pair, setPair] = useState<StockPair | undefined>(undefined);
  useEffect(() => {
    if (!pair) {
      push({ pathname, query: { select: 'true' } });
    }
  }, [pair]);

  const handleSelectPair: HandleSelectPair = useCallback((newPair) => {
    setPair(newPair);
  }, []);

  const [stockWalletAmount, setStockWalletAmount] = useState<number>(0);
  const [cryptoWalletAmount, setCryptoWalletAmount] = useState<number>(0);

  const walletPortfolio = useMemo(
    () =>
      ({
        stock: {
          amount: stockWalletAmount,
        },
        crypto: {
          amount: cryptoWalletAmount,
        },
      } as Portfolio),
    [stockWalletAmount, cryptoWalletAmount]
  );

  const handleFetchStockWallet: HandleFetchWallet = useCallback(async () => {
    const {
      stock: { uid: id },
    } = pair!;

    const {
      data: { data: amount },
    } = await api.get<{ data: number }>(`/api/stock/${id}/balance`);

    setStockWalletAmount(amount);
  }, [pair]);
  const handleFetchCryptoWallet: HandleFetchWallet = useCallback(async () => {
    const {
      crypto: { uid: id },
    } = pair!;

    const {
      data: { data: amount },
    } = await api.get<{ data: number }>(`/api/currency/${id}/balance`);

    setCryptoWalletAmount(amount);
  }, [pair]);

  const value = useMemo<IEquitiesContext>(
    () =>
      ({
        pair,
        handleSelectPair,
        walletPortfolio,
        handleFetchStockWallet,
        handleFetchCryptoWallet,
      } as IEquitiesContext),
    [
      pair,
      handleSelectPair,
      walletPortfolio,
      handleFetchStockWallet,
      handleFetchCryptoWallet,
    ]
  );

  return (
    <EquitiesContext.Provider value={value}>
      {children}
    </EquitiesContext.Provider>
  );
};
