import listCurrencies from '@libs/firebase/functions/currency/listCurrencies';
import getAssetsByWalletUid from '@libs/firebase/functions/wallet/asset/getAssetsByWalletUid';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';
import { Asset } from '@contracts/Wallet';

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

  currencies.forEach((currency) => {
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
      quote: currency?.quote ?? 0,
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
  });

  return {
    fiat: fiatCurrency,
    crypto: cryptoCurrency,
    total,
  };
};
