import { Address } from './Addres';

export type CurrencyType = 'crypto' | 'fiat';

export type Currency = {
  uid: string;
  name: string;
  symbol: string;
  logo: string;
  cmcId: number;
  quote?: number;
  type: CurrencyType;
  sign?: string;
  deposit?: boolean;
  walletAddresses?: Address[];
  createdAt: Date;
  updatedAt: Date;
};

type PercentChange = {
  rasing: boolean;
  value: number;
};
export type CurrencyQuote = {
  uid: string;
  name: string;
  symbol: string;
  logo: string;
  cmcId: number;
  price: number;
  percentChange: {
    '24h': PercentChange;
    '7d': PercentChange;
  };
  marketCap: number;
  volume24h: number;
  quotes: Quotes;
};

export interface Quote {
  date: string;
  price: number;
}
export type Quotes = Array<Quote>;
