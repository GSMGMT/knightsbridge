import {
  MarketStackApiUrls,
  Ticker,
  MarketStackApiDTO,
} from '@contracts/MarketStack';

import { requestMarketStack } from '../request';

interface FetchTickerParams {
  exchange?: string;
}
export const fetchTickers = async (
  data: MarketStackApiDTO<FetchTickerParams> = {}
) => {
  const { data: tickers } = await requestMarketStack<{
    data: Ticker[];
  }>(MarketStackApiUrls.TICKERS, { ...data });

  return tickers;
};
