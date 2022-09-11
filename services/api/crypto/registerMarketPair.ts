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

const removeApiUrl = <T>(data: T & { logo: string }) => {
  const [, logo] = data.logo.split(`${process.env.API_URL}/`);
  return {
    ...data,
    logo,
  };
};

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

  const currencyFromCmc = data[cmcId];

  if (currencyFromCmc.category?.toUpperCase() === 'FIAT') {
    throw Error('Fiat currency not registered in the system');
  }

  const { buffer, filename, mimetype } = await fetchLogoFromCoinMarket(
    currencyFromCmc.logo
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
      name: currencyFromCmc.name,
      symbol: currencyFromCmc.symbol,
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
      logo: filePath,
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
  const foundMarketPair = await getMarketPairByName(cmcId, exchangeCmcId);

  if (foundMarketPair) {
    throw Error('Market pair already registered');
  }

  const [baseCurrency, quoteCurrency, exchange] = await Promise.all([
    fetchCurrencyByCmcId(baseCmcId).then(removeApiUrl<Currency>),
    fetchCurrencyByCmcId(quoteCmcId).then(removeApiUrl<Currency>),
    fetchExchange(exchangeCmcId).then(removeApiUrl<Exchange>),
  ]);

  const marketPair = await insertMarketPair({
    base: {
      cmcId: baseCurrency.cmcId,
      logo: baseCurrency.logo,
      name: baseCurrency.name,
      symbol: baseCurrency.symbol,
      type: baseCurrency.type,
      uid: baseCurrency.uid,
      quote: baseCurrency.quote,
      sign: baseCurrency.sign,
    },
    quote: {
      cmcId: quoteCurrency.cmcId,
      logo: quoteCurrency.logo,
      name: quoteCurrency.name,
      symbol: quoteCurrency.symbol,
      type: quoteCurrency.type,
      uid: quoteCurrency.uid,
      quote: quoteCurrency.quote,
      sign: quoteCurrency.sign,
    },
    exchange: {
      cmcId: exchange.cmcId,
      logo: exchange.logo,
      name: exchange.name,
      slug: exchange.slug,
      uid: exchange.uid,
    },
    cmcId,
    name,
  });

  return marketPair;
};
