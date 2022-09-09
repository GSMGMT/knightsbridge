import { OmitTimestamp } from '@utils/types';
import { Currency } from './Currency';
import { Exchange } from './Exchange';

export type MarketPair = {
  uid: string;
  exchange: OmitTimestamp<Exchange>;
  name: string;
  cmcId: number;
  base: OmitTimestamp<Currency>;
  quote: OmitTimestamp<Currency>;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MarketPairCmcData = {
  name: string;
  cmcId: number;
  baseCmcId: number;
  baseType: string;
  quoteCmcId: number;
  quoteType: string;
  logo: string;
};
