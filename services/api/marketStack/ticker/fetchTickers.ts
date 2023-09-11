import { Ticker } from '@contracts/MarketStack';

import { RequestMarketStack } from '../request';

export const fetchTickers = (): RequestMarketStack<{
  data: Ticker[];
}> => ({
  data: [],
  pagination: {
    count: 0,
    limit: 0,
    offset: 0,
    total: 0,
  },
});
