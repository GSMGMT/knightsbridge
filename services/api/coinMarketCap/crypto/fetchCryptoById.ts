import { CmcApiUrls, CoinMarketDTO } from '@contracts/CoinMarket';
import { parseToUrlQuery } from '@utils/parseToUrlQuery';

import { requestCoinMarketCap } from '../request';

export const fetchCryptoById = async (id: number | number[]) =>
  requestCoinMarketCap(
    CmcApiUrls.QUOTES_LATEST,
    parseToUrlQuery<CoinMarketDTO>({
      id,
    })
  );
