import { createContext } from 'react';

import { PairSource } from '@services/api/fetchSources';

export type HandleSelectPair = (pair?: PairSource) => void;

interface Wallet {
  amount: number;
}
export interface Portfolio {
  base: Wallet;
  pair: Wallet;
}
export const defaultPortfolio: Portfolio = {
  base: {
    amount: 0,
  },
  pair: {
    amount: 0,
  },
};

export type HandleFetchWallet = () => Promise<void>;

export type FetchCoins = (args?: {
  pageNumber?: number;
  search?: string;
}) => Promise<void>;

export interface IExchangeContext {
  pair?: PairSource;
  handleSelectPair: HandleSelectPair;
  walletPortfolio: Portfolio;
  handleFetchBaseCurrencyWallet: HandleFetchWallet;
  handleFetchPairCurrencyWallet: HandleFetchWallet;
}
export const ExchangeContext = createContext<IExchangeContext>({
  pair: undefined,
  handleSelectPair: () => {},
  walletPortfolio: defaultPortfolio,
  handleFetchBaseCurrencyWallet: async () => {},
  handleFetchPairCurrencyWallet: async () => {},
});
