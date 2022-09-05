import { CmcApiUrls, CoinMarketDTO } from '@contracts/CoinMarket';
import { parseToUrlQuery } from '@utils/parseToUrlQuery';

import { requestCoinMarketCap } from '../request';

export const fetchExchange = async (data: CoinMarketDTO) => {
  const params = parseToUrlQuery<CoinMarketDTO>(data);

  const response = await requestCoinMarketCap(CmcApiUrls.EXCHANGE_MAP, params);

  const ids = response.data.map((exchange) => exchange.id);

  const exchangeInfo: CoinMarketDTO = {
    id: ids,
    aux: ['logo'],
  };

  const { data: exchangeInfos } = await requestCoinMarketCap(
    CmcApiUrls.INFO_EXCHANGE,
    parseToUrlQuery<CoinMarketDTO>(exchangeInfo)
  );

  // eslint-disable-next-line no-return-assign
  const exchanges = response.data.map((exchange) => ({
    id: exchange.id,
    name: exchange.name,
    slug: exchange.slug,
    logo: exchangeInfos[exchange.id]?.logo,
  }));

  return exchanges;
};
