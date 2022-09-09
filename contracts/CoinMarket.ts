type Currency = 'CRYPTOCURRENCY' | 'FIAT';

export type Aux =
  | 'urls'
  | 'logo'
  | 'description'
  | 'tags'
  | 'platform'
  | 'date_added'
  | 'notice'
  | 'status';

export type Sort =
  | 'name'
  | 'symbol'
  | 'date_added'
  | 'market_cap'
  | 'market_cap_strict'
  | 'price'
  | 'circulating_supply'
  | 'total_supply'
  | 'max_supply'
  | 'num_market_pairs'
  | 'volume_24h'
  | 'volume_24h_adjusted'
  | 'percent_change_1h'
  | 'percent_change_24h'
  | 'percent_change_7d'
  | 'market_cap_by_total_supply_strict'
  | 'volume_7d'
  | 'volume_30d'
  | 'exchange_score';

export type SortDir = 'asc' | 'desc';

export type Interval =
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | '1h'
  | '2h'
  | '3h'
  | '4h'
  | '6h'
  | '12h'
  | '1d'
  | '2d'
  | '3d'
  | '7d'
  | '14d'
  | '15d'
  | '30d'
  | '60d'
  | '90d'
  | '365d';

export type Category =
  | 'all'
  | 'spot'
  | 'derivatives'
  | 'otc'
  | 'futures'
  | 'perpetual';

export enum Convert {
  USD = 2781,
}

export enum CmcApiUrls {
  BASE = 'https://pro-api.coinmarketcap.com',
  QUOTES_LATEST = '/v2/cryptocurrency/quotes/latest',
  QUOTES_HISTORICAL = '/v2/cryptocurrency/quotes/historical',
  LISTING_LATEST = '/v1/cryptocurrency/listings/latest',
  INFO = '/v2/cryptocurrency/info',
  TRENDING = '/v1/cryptocurrency/trending/gainers-losers',
  OHLCV_HISTORICAL = '/v2/cryptocurrency/ohlcv/historical',
  OHLCV_LATEST = '/v2/cryptocurrency/ohlcv/latest',
  GLOBAL_QUOTES_LATEST = '/v1/global-metrics/quotes/latest',
  EXCHANGE_LISTING = '/v1/exchange/listings/latest',
  MARKET_PAIR_LATEST = '/v1/exchange/market-pairs/latest',
  INFO_EXCHANGE = '/v1/exchange/info',
  EXCHANGE_MAP = '/v1/exchange/map',
  CRYPTO_MARKET_PAIR_LATEST = '/v2/cryptocurrency/market-pairs/latest',
}

export type CmcApiResponse = {
  status: Status;
  data: Data & Data[];
};

type Status = {
  timestamp: string;
  error_code: number;
  error_message: string;
  elapsed: number;
  credit_count: number;
  notice: string;
  total_count: number;
};

type Data = {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  nim_market_pairs: number;
  num_market_pairs: number;
  max_supply: number;
  circulating_supply: number;
  total_supply: number;
  platform: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    token_address: string;
  };
  quote?: Quote;
  logo: string;
  date_added?: string;
  last_updated: string;
  quotes?: [
    {
      quote: Quote;
    }
  ];
  cmc_rank: number;
  rank: number;
  market_pairs: MarketPair[];
  category?: string;
};

type Quote = {
  2781: {
    timestamp: string;
    price: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    percent_change_24h: number;
    percent_change_7d: number;
    total_market_cap: number;
  };
};

type MarketPair = {
  exchange: {
    id: number;
  };
  quote: Quote;
  market_id: number;
  market_pair: string;
  category: string;
  fee_type: string;
  market_pair_base: {
    currency_id: number;
    currency_type: Currency;
  };
  market_pair_quote: {
    currency_id: number;
    currency_type: Currency;
  };
};

export type CoinMarketDTO = {
  start?: number;
  limit?: number;
  symbol?: string | string[];
  aux?: Aux | Aux[];
  convert_id?: number;
  id?: number | number[];
  sort?: Sort;
  sort_dir?: SortDir;
  time_period?: string;
  time_start?: number;
  time_end?: number;
  interval?: Interval;
  category?: Category;
  matched_id?: number;
  slug?: string | string[];
};
