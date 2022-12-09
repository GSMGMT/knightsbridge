import {
  MarketStackApiUrls,
  Ticker,
  MarketStackApiDTO,
} from '@contracts/MarketStack';

import { requestMarketStack } from '../request';

interface FetchTickerParams {
  exchange?: string;
}
export const fetchTicker = async (
  data: MarketStackApiDTO<FetchTickerParams> = {}
) => {
  const { data: exchanges } = await requestMarketStack<{
    data: Ticker[];
  }>(MarketStackApiUrls.TICKERS, { ...data });

  return exchanges;
};
