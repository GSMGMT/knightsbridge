import DineroFactory from 'dinero.js';
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

  const amount = DineroFactory({ amount: asset.amount });
  const reserved = DineroFactory({ amount: asset.reserved });

  const balance = amount.subtract(reserved);

  return balance.getAmount();
};
