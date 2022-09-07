import { CmcApiUrls, CoinMarketDTO } from '@contracts/CoinMarket';
import { parseToUrlQuery } from '@utils/parseToUrlQuery';

import { requestCoinMarketCap } from '../request';

export const fetchCryptoBySymbol = (symbol: string | string[]) =>
  requestCoinMarketCap(
    CmcApiUrls.QUOTES_LATEST,
    parseToUrlQuery<CoinMarketDTO>({
      symbol,
    })
  );
