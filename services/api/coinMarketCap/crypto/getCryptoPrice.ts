import { CmcApiUrls, CoinMarketDTO } from '@contracts/CoinMarket';
import { parseToUrlQuery } from '@utils/parseToUrlQuery';

import { requestCoinMarketCap } from '../request';

export const fetchCryptoPrice = async (id: number) => {
  const { data } = await requestCoinMarketCap(
    CmcApiUrls.QUOTES_LATEST,
    parseToUrlQuery<CoinMarketDTO>({
      id,
    })
  );

  return data[id].quote?.USD.price;
};
