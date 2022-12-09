import {
  MarketStackApiUrls,
  Exchange,
  MarketStackApiDTO,
} from '@contracts/MarketStack';

import { requestMarketStack } from '../request';

export const fetchExchange = async (data: MarketStackApiDTO = {}) => {
  const { data: exchanges } = await requestMarketStack<{
    data: Exchange[];
  }>(MarketStackApiUrls.EXCHANGES, { ...data });

  return exchanges;
};
