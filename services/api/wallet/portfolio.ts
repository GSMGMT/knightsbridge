import DineroFactory from 'dinero.js';

import listCurrencies from '@libs/firebase/functions/currency/listCurrencies';
import getAssetsByWalletUid from '@libs/firebase/functions/wallet/asset/getAssetsByWalletUid';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';

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

  let assets = new Map();

  if (wallet) {
    assets = await getAssetsByWalletUid(wallet.uid).then(
      (fetchedAssets) =>
        new Map(fetchedAssets.map((asset) => [asset.currency.uid, asset]))
    );
  }

  const currencies = await listCurrencies({
    size: 100,
  });

  let total = DineroFactory({ amount: 0 });

  const fiatCurrency: CurrencyData[] = [];
  const cryptoCurrency: CurrencyData[] = [];

  currencies.forEach((currency) => {
    const currencyAsset = assets.get(currency.uid);

    const assetAmount = DineroFactory({ amount: currencyAsset?.amount ?? 0 });
    const assetReserved = DineroFactory({
      amount: currencyAsset?.reserved ?? 0,
    });

    total = total.add(assetAmount.multiply(currency?.quote ?? 0));

    const currencyData: CurrencyData = {
      uid: currency.uid,
      name: currency.name,
      code: currency.symbol,
      quote: currency?.quote ?? 0,
      logo: currency.logo,
      amount: assetAmount.getAmount(),
      reserved: assetReserved.getAmount(),
      available: assetAmount.subtract(assetReserved).getAmount(),
    };

    if (currency.type === 'crypto') {
      cryptoCurrency.push(currencyData);
    } else {
      fiatCurrency.push(currencyData);
    }
  });

  return {
    fiat: fiatCurrency,
    crypto: cryptoCurrency,
    total: total.getAmount(),
  };
};
