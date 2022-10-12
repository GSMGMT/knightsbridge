import { CmcApiUrls } from '@contracts/CoinMarket';
import { parseToUrlQuery } from '@utils/parseToUrlQuery';

import { requestCoinMarketCap } from '../request';

export const fetchHistoricalQuoteById = (
  id: string | string[],
  requestInfo?: {
    [key: string]: string | string[];
  }
) => {
  const { convertId, ...requestData } = requestInfo || {};

  return requestCoinMarketCap(
    CmcApiUrls.OHLCV_HISTORICAL,
    parseToUrlQuery({
      id,
      convert_id: convertId,
      ...requestData,
    })
  );
};
