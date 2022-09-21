import axios from 'axios';

import { CmcApiResponse, CmcApiUrls } from '@contracts/CoinMarket';

export const requestCoinMarketCap = async (
  endpoint: CmcApiUrls,
  param?: string
): Promise<CmcApiResponse> => {
  let url = CmcApiUrls.BASE + endpoint;

  if (param) {
    url += `?${param}`;
  }

  const { data } = await axios.get<CmcApiResponse>(url, {
    headers: {
      'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
    },
  });

  return data;
};
