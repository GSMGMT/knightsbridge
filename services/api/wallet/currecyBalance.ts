import getAssetByCurrencyUid from '@libs/firebase/functions/wallet/asset/getAssetByCurrencyUid';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';

export const currencyBalance = async (userUid: string, currencyUid: string) => {
  const wallet = await getWalletByUserUid(userUid);

  if (!wallet) {
    return 0.0;
  }

  const asset = await getAssetByCurrencyUid(wallet.uid, currencyUid);

  if (!asset) {
    return 0.0;
  }

  const { amount, reserved } = asset;

  const balance = amount - reserved;

  return balance;
};
