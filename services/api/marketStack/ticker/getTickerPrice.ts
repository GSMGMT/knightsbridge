import { Intraday } from '@contracts/MarketStack';

import { RequestMarketStack } from '../request';

export const getTickerPrice = (): RequestMarketStack<{
  data: Intraday[];
}> => ({
  data: [],
  pagination: {
    count: 0,
    limit: 0,
    offset: 0,
    total: 0,
  },
});
