import { MarketStackApiUrls, Exchange } from '@contracts/MarketStack';

import { requestMarketStack } from '../request';

interface FetchTickerParams {
  symbol: string;
}
export const fetchExchange = async (data: FetchTickerParams) => {
  const exchange = await requestMarketStack<Exchange>(
    `${MarketStackApiUrls.EXCHANGES}/${data.symbol}`
  );

  return exchange;
};
