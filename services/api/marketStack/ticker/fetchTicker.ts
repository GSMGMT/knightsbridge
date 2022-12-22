import { MarketStackApiUrls, Ticker } from '@contracts/MarketStack';

import { requestMarketStack } from '../request';

interface FetchTickerParams {
  symbol: string;
}
export const fetchTicker = async (data: FetchTickerParams) => {
  const ticker = await requestMarketStack<Ticker>(
    `${MarketStackApiUrls.TICKERS}/${data.symbol}`
  );

  return ticker;
};
