import listCurrencies from '@libs/firebase/functions/presale/coin/listCoins';
import getAssetsByWalletUid from '@libs/firebase/functions/wallet/presaleAsset/getAssetsByWalletUid';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';
import { PresaleAsset as Asset } from '@contracts/PresaleAsset';
import { fetchCryptoPrice } from '../coinMarketCap/crypto/getCryptoPrice';

export type PresaleData = {
  uid: string;
  name: string;
  code: string;
  quote: number;
  price: number;
  logo: string;
  balance: number;
  amount: number;
  baseCurrency: string;
};

type Portfolio = {
  assets: PresaleData[];
  total: number;
};

export const usersPresalePortfolio = async (
  userUid: string
): Promise<Portfolio> => {
  const wallet = await getWalletByUserUid(userUid);

  let assets: Asset[] = [];

  if (wallet) {
    assets = await getAssetsByWalletUid(wallet.uid).then(
      (fetchedAssets) => fetchedAssets.filter((asset) => asset.amount > 0) ?? []
    );
  }

  const currencies = await listCurrencies();

  const portfolio: PresaleData[] = [];

  let total = 0;

  for await (const currency of currencies) {
    const currencyAsset = assets.find(
      (asset) => currency.uid === asset.coin.uid
    );

    const currencyAmount = currencyAsset?.amount ?? 0;

    total += currencyAmount;

    const currencyData: PresaleData = {
      uid: currency.uid,
      name: currency.name,
      code: currency.symbol,
      quote: currency?.quote ?? 1,
      price: currency?.quote ?? 1,
      logo: currency.icon,
      balance: currencyAmount,
      amount: currency.amount,
      baseCurrency: currency.baseCurrency.symbol,
    };

    portfolio.push(currencyData);
  }

  await Promise.all([
    ...portfolio.map(async (currency) => {
      const defaultCurrency = currencies.find(
        (crypto) => crypto.uid === currency.uid
      )!;

      const price = await fetchCryptoPrice(defaultCurrency.baseCurrency.cmcId);

      // eslint-disable-next-line no-param-reassign
      currency.price = price ?? 1;
    }),
  ]);

  return {
    assets: portfolio,
    total,
  };
};
