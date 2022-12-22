import getStockBySymbol from '@libs/firebase/functions/stock/getStockBySymbol';
import insertStock from '@libs/firebase/functions/stock/insertStock';
import getCurrencyBySymbol from '@libs/firebase/functions/currency/getCurrencyBySymbol';
import getStockExchangeByMIC from '@libs/firebase/functions/stockExchange/getStockExchangeByMIC';
import insertStockExchange from '@libs/firebase/functions/stockExchange/insertStockExchange';
import getStockPairByStockSymbol from '@libs/firebase/functions/stockPair/getStockPairByStockSymbol';

import insertStockPair from '@libs/firebase/functions/stockPair/insertStockPair';
import { removeApiUrl } from '@utils/removeApiUrl';
import { Currency } from '@contracts/Currency';
import { fetchTicker } from '../marketStack/ticker/fetchTicker';

interface RegisterStockPairDTO {
  symbol: string;
}
type RegisterStockPair = (data: RegisterStockPairDTO) => Promise<string>;
export const registerStockPair: RegisterStockPair = async (data) => {
  let stockPair = await getStockPairByStockSymbol(data.symbol);

  if (stockPair) throw new Error('Stock pair already exists');

  const ticker = await fetchTicker(data);

  const stockExchange = getStockExchangeByMIC(ticker.stock_exchange.mic).then(
    async (fetchedData) => {
      let newExchange = fetchedData;

      if (!newExchange) {
        newExchange = await insertStockExchange({
          mic: ticker.stock_exchange.mic,
          acronym: ticker.stock_exchange.acronym,
          country: ticker.stock_exchange.country,
          countryCode: ticker.stock_exchange.country_code,
          name: ticker.stock_exchange.name,
        });
      }

      return newExchange;
    }
  );

  const stock = getStockBySymbol(data.symbol).then(async (fetchedData) => {
    let newStock = fetchedData;

    if (!newStock) {
      newStock = await insertStock({
        name: ticker.name,
        history: ticker.has_eod,
        symbol: ticker.symbol,
      });
    }

    return newStock;
  });

  const currency = await getCurrencyBySymbol('USDT').then((currencyData) => {
    if (currencyData) return removeApiUrl(currencyData) as Currency;
  });
  if (!currency) throw new Error('USDT Currency not found');

  const [newStockExchange, newStock] = await Promise.all([
    stockExchange,
    stock,
  ]);

  stockPair = await insertStockPair({
    crypto: {
      cmcId: currency.cmcId,
      symbol: currency.symbol,
      logo: currency.logo,
      name: currency.name,
      type: currency.type,
      uid: currency.uid,
      quote: currency.quote,
      sign: currency.sign,
    },
    enabled: true,
    exchange: {
      acronym: newStockExchange.acronym,
      country: newStockExchange.country,
      countryCode: newStockExchange.countryCode,
      mic: newStockExchange.mic,
      name: newStockExchange.name,
      uid: newStockExchange.uid,
    },
    stock: {
      history: newStock.history,
      name: newStock.name,
      symbol: newStock.symbol,
      uid: newStock.uid,
    },
  });

  return stockPair.uid;
};
