import getStockPairByUid from '@libs/firebase/functions/stockPair/getStockPairByUid';

import { fetchCryptoPrice } from '../coinMarketCap/crypto/getCryptoPrice';
import { getTickerPrice } from '../marketStack/ticker/getTickerPrice';

type GetStockPairPrice = (stockId: string) => Promise<number>;
export const getStockPairPrice: GetStockPairPrice = async (stockId) => {
  const stockPair = await getStockPairByUid(stockId);

  if (!stockPair) throw new Error('Stock pair not found');

  const { stock, crypto } = stockPair;

  const stockPricePromise = getTickerPrice({ symbols: stock.symbol });
  const cryptoPricePromise = fetchCryptoPrice(crypto.cmcId);

  const [stockPrice, cryptoPrice] = await Promise.all([
    stockPricePromise,
    cryptoPricePromise,
  ]);

  const price = stockPrice / cryptoPrice!;

  return price;
};
