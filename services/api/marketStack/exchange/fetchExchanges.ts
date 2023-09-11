import { Exchange } from '@contracts/MarketStack';

import { RequestMarketStack } from '../request';

export const fetchExchanges = (): RequestMarketStack<{
  data: Exchange[];
}> => ({
  data: [],
  pagination: {
    count: 0,
    limit: 100,
    offset: 0,
    total: 0,
  },
});
