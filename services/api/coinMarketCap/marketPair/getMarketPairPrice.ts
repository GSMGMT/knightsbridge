import { CmcApiUrls, CoinMarketDTO, Convert } from '@contracts/CoinMarket';
import { MarketPair } from '@contracts/MarketPair';
import { parseToUrlQuery } from '@utils/parseToUrlQuery';

import { requestCoinMarketCap } from '../request';

export interface Price {
  price: number;
  usdQuote: number;
}

export const getPairPrice: (marketPair: MarketPair) => Promise<Price> = async (
  marketPair
) => {
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
  const price = exchange?.quote.exchange_reported.price;
  const usdQuote = exchange?.quote[2781].price;

  return {
    price,
    usdQuote,
  } as Price;
};
