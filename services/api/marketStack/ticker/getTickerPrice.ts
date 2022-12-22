import {
  MarketStackApiUrls,
  Intraday,
  MarketStackApiDTO,
} from '@contracts/MarketStack';

import { requestMarketStack } from '../request';

interface FetchTickerParams {
  symbols?: string;
}
export const getTickerPrice = async (
  data: MarketStackApiDTO<FetchTickerParams> = {}
) => {
  const {
    data: [{ open: price }],
  } = await requestMarketStack<{
    data: Intraday[];
  }>(MarketStackApiUrls.INTRADAY_LATEST, { ...data });

  return price;
};
