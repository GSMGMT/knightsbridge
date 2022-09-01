export type CurrencyType = 'crypto' | 'fiat';

export type Currency = {
  uid: string;
  name: string;
  symbol: string;
  logo: string;
  sign?: string;
  cmcId: number;
  quote: number;
  type: CurrencyType;
  createdAt: Date;
  updatedAt: Date;
};
