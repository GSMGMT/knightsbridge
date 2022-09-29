import { OmitTimestamp } from '@utils/types';
import { Currency } from './Currency';

export type CryptoCurrency = Omit<
  OmitTimestamp<Currency>,
  'sign' | 'quote' | 'deposit' | 'walletAddresses'
>;

export interface PresaleCoin {
  uid: string;
  name: string;
  symbol: string;
  quote: number;
  icon: string;
  baseCurrency: CryptoCurrency;
  availableAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
