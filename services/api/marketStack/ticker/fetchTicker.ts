import { Ticker } from '@contracts/MarketStack';

import { RequestMarketStack } from '../request';

export const fetchTicker = (): RequestMarketStack<Ticker> => ({
  country: '',
  has_eod: false,
  has_intraday: false,
  name: '',
  pagination: {
    count: 0,
    limit: 100,
    offset: 0,
    total: 0,
  },
  stock_exchange: {
    acronym: '',
    city: '',
    country: '',
    country_code: '',
    mic: '',
    name: '',
    website: '',
  },
  symbol: '',
});
