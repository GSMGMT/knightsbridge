import { StockExchange as MSStockExchange } from './MarketStack';

export interface StockExchange
  extends Omit<MSStockExchange, 'country_code' | 'city' | 'website'> {
  uid: string;
  countryCode: string;
  createdAt: Date;
  updatedAt: Date;
}
