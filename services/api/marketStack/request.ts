import axios from 'axios';

import {
  MarketStackApiResponse,
  MarketStackApiUrls,
} from '@contracts/MarketStack';

export const requestMarketStack = async <T>(
  endpoint: MarketStackApiUrls | string,
  params?: {
    [key: string]: string;
  }
): Promise<MarketStackApiResponse<T>> => {
  const url = MarketStackApiUrls.BASE + endpoint;
  const requestParams = {
    access_key: process.env.MARKETSTACK_API_KEY,
  };

  const { data } = await axios.get<MarketStackApiResponse<T>>(url, {
    params: {
      ...requestParams,
      ...params,
    },
  });

  return data;
};
