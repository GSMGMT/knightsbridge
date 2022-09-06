import { CmcApiUrls, CoinMarketDTO } from '@contracts/CoinMarket';
import { MarketPairCmcData } from '@contracts/MarketPair';
import { parseToUrlQuery } from '@utils/parseToUrlQuery';
import { fetchCryptoBySlug } from '../crypto/fetchCryptoBySlug';
import { fetchCryptoBySymbol } from '../crypto/fetchCryptoBySymbol';

import { requestCoinMarketCap } from '../request';

export const fetchMarketPair = async (
  payload: CoinMarketDTO,
  search?: string
): Promise<MarketPairCmcData | MarketPairCmcData[]> => {
  if (search) {
    const crypto = await fetchCryptoBySlug(search.split(','))
      .catch(() => fetchCryptoBySymbol(search.split(',')))
      .then(({ data }) => new Map(Object.entries(data)));

    // eslint-disable-next-line no-param-reassign
    payload.matched_id = crypto.get(search.toUpperCase())?.id;
  }

  const params = parseToUrlQuery<CoinMarketDTO>({
    ...payload,
    category: 'spot',
  });

  const { data } = await requestCoinMarketCap(
    CmcApiUrls.MARKET_PAIR_LATEST,
    params
  );

  const baseIds = Array.from(
    new Set(
      data.market_pairs.map(
        (marketPair) => marketPair.market_pair_base.currency_id
      )
    )
  );

  const cryptoInfoDTO: CoinMarketDTO = {
    id: baseIds,
    aux: ['logo'],
  };

  const { data: coinsInfo } = await requestCoinMarketCap(
    CmcApiUrls.INFO,
    parseToUrlQuery<CoinMarketDTO>(cryptoInfoDTO)
  );

  const marketPairs: MarketPairCmcData[] = data.market_pairs.map(
    (marketPair) => ({
      cmcId: marketPair.market_id,
      name: marketPair.market_pair,
      baseCmcId: marketPair.market_pair_base.currency_id,
      quoteCmcId: marketPair.market_pair_quote.currency_id,
      category: marketPair.category,
      logo: coinsInfo[marketPair.market_pair_base.currency_id].logo,
    })
  );

  return marketPairs;
};
