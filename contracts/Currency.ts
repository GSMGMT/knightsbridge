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
