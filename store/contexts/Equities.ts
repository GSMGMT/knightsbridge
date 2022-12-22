import { createContext } from 'react';

import { StockPair } from '@contracts/StockPair';

interface StockPairPrice extends StockPair {
  price: number;
}

export type HandleSelectPair = (pair?: StockPairPrice) => void;

interface Wallet {
  amount: number;
}
export interface Portfolio {
  stock: Wallet;
  crypto: Wallet;
}
export const defaultPortfolio: Portfolio = {
  stock: {
    amount: 0,
  },
  crypto: {
    amount: 0,
  },
};

export type HandleFetchWallet = () => Promise<void>;

export type FetchCoins = (args?: {
  pageNumber?: number;
  search?: string;
}) => Promise<void>;

export interface IEquitiesContext {
  pair?: StockPairPrice;
  handleSelectPair: HandleSelectPair;
  walletPortfolio: Portfolio;
  handleFetchStockWallet: HandleFetchWallet;
  handleFetchCryptoWallet: HandleFetchWallet;
}
export const EquitiesContext = createContext<IEquitiesContext>({
  pair: undefined,
  handleSelectPair: () => {},
  walletPortfolio: defaultPortfolio,
  handleFetchStockWallet: async () => {},
  handleFetchCryptoWallet: async () => {},
});
