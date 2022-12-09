interface Currency {
  code: string;
  name: string;
  symbol: string;
}
interface Timezone {
  timezone: string;
  abbr: string;
  abbr_dst: string;
}

interface StockExchange {
  name: string;
  acronym: string;
  mic: string;
  country: string;
  country_code: string;
  city: string;
  website: string;
}

export interface Exchange extends StockExchange {
  currency: Currency;
  timezone: Timezone;
}

export interface Ticker {
  name: string;
  symbol: string;
  has_intraday: boolean;
  has_eod: boolean;
  country: string;
  stock_exchange: StockExchange;
}

interface Pagination {
  limit: number;
  offset: number;
  count: number;
  total: number;
}
export type MarketStackApiResponse<T> = T & {
  pagination: Pagination;
};

export type MarketStackApiDTO<T = {}> = T & {
  search?: string;
  limit?: string;
  offset?: string;
};

export enum MarketStackApiUrls {
  BASE = 'http://api.marketstack.com/v1',
  EXCHANGES = '/exchanges',
  TICKERS = '/tickers',
}
