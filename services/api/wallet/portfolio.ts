import listCurrencies from '@libs/firebase/functions/currency/listCurrencies';
import getAssetsByWalletUid from '@libs/firebase/functions/wallet/asset/getAssetsByWalletUid';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';
import { Asset } from '@contracts/Wallet';
import { fetchCryptoPrice } from '../coinMarketCap/crypto/getCryptoPrice';

type CurrencyData = {
  uid: string;
  name: string;
  code: string;
  quote: number;
  logo: string;
  amount: number;
  reserved: number;
  available: number;
};

type Portfolio = {
  crypto: CurrencyData[];
  fiat: CurrencyData[];
  total: number;
};

export const usersPortfolio = async (userUid: string): Promise<Portfolio> => {
  const wallet = await getWalletByUserUid(userUid);

  let assets: Asset[] = [];

  if (wallet) {
    assets = await getAssetsByWalletUid(wallet.uid).then(
      (fetchedAssets) => fetchedAssets.filter((asset) => asset.amount > 0) ?? []
    );
  }

  const currencies = await listCurrencies({
    size: 100,
  });

  let total = 0;

  const fiatCurrency: CurrencyData[] = [];
  const cryptoCurrency: CurrencyData[] = [];

  for await (const currency of currencies) {
    const currencyAsset = assets.find(
      (asset) => currency.uid === asset.currency.uid
    );

    const currencyAmount = currencyAsset?.amount ?? 0;

    const currencyReservedAmount = currencyAsset?.reserved ?? 0;

    total += currencyAmount;

    const currencyData: CurrencyData = {
      uid: currency.uid,
      name: currency.name,
      code: currency.symbol,
      quote: currency?.quote ?? 1,
      logo: currency.logo,
      amount: currencyAmount,
      reserved: currencyReservedAmount,
      available: currencyAmount - currencyReservedAmount,
    };

    if (currency.type === 'crypto') {
      cryptoCurrency.push(currencyData);
    } else {
      fiatCurrency.push(currencyData);
    }
  }

  await Promise.all([
    ...cryptoCurrency.map(async (currency) => {
      const defaultCurrency = currencies.find(
        (crypto) => crypto.uid === currency.uid
      )!;

      const price = await fetchCryptoPrice(defaultCurrency.cmcId);

      // eslint-disable-next-line no-param-reassign
      currency.quote = price ?? 1;
    }),
  ]);

  return {
    fiat: fiatCurrency,
    crypto: cryptoCurrency,
    total,
  };
};
