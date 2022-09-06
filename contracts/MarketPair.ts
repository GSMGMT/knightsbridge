import { Currency } from './Currency';
import { Exchange } from './Exchange';

export type MarketPair = {
  uid: string;
  exchange: Exchange;
  name: string;
  cmcId: number;
  base: Currency;
  quote: Currency;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};
