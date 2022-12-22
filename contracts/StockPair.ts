import { OmitTimestamp } from '@utils/types';

import { StockExchange } from './StockExchange';
import { Stock } from './Stock';
import { Currency } from './Currency';

export interface StockPair {
  uid: string;
  exchange: OmitTimestamp<StockExchange>;
  stock: OmitTimestamp<Stock>;
  crypto: OmitTimestamp<Currency>;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
