import axios from 'axios';
import { randomBytes } from 'crypto';
import { CmcApiUrls, CoinMarketDTO } from '@contracts/CoinMarket';
import { Currency } from '@contracts/Currency';
import getCurrencyByCmcId from '@libs/firebase/functions/currency/getCurrencyByCmcId';
import insertCurrency from '@libs/firebase/functions/currency/insertCurrency';
import getExchangeByCmcId from '@libs/firebase/functions/exchange/getExchangeByCmcId';
import getMarketPairByName from '@libs/firebase/functions/marketPair/getMarketPairByName';
import insertMarketPair from '@libs/firebase/functions/marketPair/insertMarketPair';
import uploadFileToStorage, {
  File,
} from '@libs/firebase/functions/storage/uploadFile';
import { parseToUrlQuery } from '@utils/parseToUrlQuery';
import { Exchange } from '@contracts/Exchange';
import insertExchange from '@libs/firebase/functions/exchange/insertExchange';
import { requestCoinMarketCap } from '../coinMarketCap/request';

interface RegisterMarketPair {
  name: string;
  cmcId: number;
  baseCmcId: number;
  quoteCmcId: number;
  exchangeCmcId: number;
}

const fetchLogoFromCoinMarket = async (url: string): Promise<File> => {
  const { data: logoBinary, headers } = await axios.get(url, {
    responseType: 'arraybuffer',
  });

  const logoBuffer = Buffer.from(logoBinary, 'binary');

  const newFilename = randomBytes(12).toString('hex');

  return {
    buffer: logoBuffer,
    filename: newFilename,
    mimetype: headers['content-type'],
  };
};

const fetchCurrencyByCmcId = async (cmcId: number): Promise<Currency> => {
  const currency = await getCurrencyByCmcId(cmcId);

  if (currency) {
    return currency;
  }

  const { data } = await requestCoinMarketCap(
    CmcApiUrls.INFO,
    parseToUrlQuery<CoinMarketDTO>({
      id: cmcId,
    })
  );

  const cryptoFromCmc = data[cmcId];

  const { buffer, filename, mimetype } = await fetchLogoFromCoinMarket(
    cryptoFromCmc.logo
  );
  const filePath = `logo/${filename}`;

  const newCurrency = await uploadFileToStorage(
    {
      buffer,
      filename,
      mimetype,
    },
    filePath
  ).then(() =>
    insertCurrency({
      cmcId,
      logo: filePath,
      name: cryptoFromCmc.name,
      symbol: cryptoFromCmc.symbol,
      type: 'crypto',
    })
  );

  return newCurrency as Currency;
};

const fetchExchange = async (cmcId: number): Promise<Exchange> => {
  const exchange = await getExchangeByCmcId(cmcId);

  if (exchange) {
    return exchange;
  }

  const { data } = await requestCoinMarketCap(
    CmcApiUrls.INFO_EXCHANGE,
    parseToUrlQuery<CoinMarketDTO>({
      id: cmcId,
    })
  );

  const exchangeFromCmc = data[cmcId];

  const { buffer, filename, mimetype } = await fetchLogoFromCoinMarket(
    exchangeFromCmc.logo
  );

  const filePath = `logo/${filename}`;

  const newExchange = await uploadFileToStorage(
    {
      buffer,
      filename,
      mimetype,
    },
    filePath
  ).then(() =>
    insertExchange({
      cmcId,
      logo: exchangeFromCmc.logo,
      name: exchangeFromCmc.name,
      slug: exchangeFromCmc.slug,
    })
  );

  return newExchange as Exchange;
};

export const registerMarketPair = async ({
  name,
  cmcId,
  baseCmcId,
  quoteCmcId,
  exchangeCmcId,
}: RegisterMarketPair) => {
  const foundMarketPair = await getMarketPairByName(name);

  if (foundMarketPair) {
    throw Error('Market pair already registered');
  }

  const [baseCurrency, quoteCurrency, exchange] = await Promise.all([
    fetchCurrencyByCmcId(baseCmcId),
    fetchCurrencyByCmcId(quoteCmcId),
    fetchExchange(exchangeCmcId),
  ]);

  const marketPair = await insertMarketPair({
    base: baseCurrency,
    quote: quoteCurrency,
    exchange,
    cmcId,
    name,
  });

  return marketPair;
};
