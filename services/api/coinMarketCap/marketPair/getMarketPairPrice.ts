import { CmcApiUrls, CoinMarketDTO, Convert } from '@contracts/CoinMarket';
import { MarketPair } from '@contracts/MarketPair';
import { parseToUrlQuery } from '@utils/parseToUrlQuery';
import { requestCoinMarketCap } from '../request';

export const getPairPrice = async (marketPair: MarketPair) => {
  const pairPriceDTO: CoinMarketDTO = {
    id: marketPair.base.cmcId,
    matched_id: marketPair.quote.cmcId,
    convert_id: Convert.USD,
    limit: 5000,
  };

  const { data } = await requestCoinMarketCap(
    CmcApiUrls.CRYPTO_MARKET_PAIR_LATEST,
    parseToUrlQuery<CoinMarketDTO>(pairPriceDTO)
  );

  const exchange = data.market_pairs.find(
    (market_pair) => market_pair.exchange.id === marketPair.exchange.cmcId
  );
  const price = exchange?.quote[Convert.USD].price;

  return price;
};
