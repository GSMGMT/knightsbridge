import { increment } from 'firebase/firestore';

import getCurrencyByUid from '@libs/firebase/functions/currency/getCurrencyByUid';
import getAssetByCurrencyUid from '@libs/firebase/functions/wallet/asset/getAssetByCurrencyUid';
import insertAsset from '@libs/firebase/functions/wallet/asset/insertAsset';
import updateAsset from '@libs/firebase/functions/wallet/asset/updateAsset';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';

import { createWallet } from './createWallet';

interface WalletDeposit {
  userUid: string;
  amount: number;
  currencyUid: string;
}

export const walletDeposit = async ({
  amount,
  currencyUid,
  userUid,
}: WalletDeposit): Promise<void> => {
  const wallet =
    (await getWalletByUserUid(userUid)) ?? (await createWallet(userUid));

  if (!wallet) {
    throw Error('Wallet not found');
  }

  const asset = await getAssetByCurrencyUid(wallet.uid, currencyUid);

  if (asset) {
    await updateAsset(wallet.uid, asset.uid, {
      amount: increment(amount),
    });
  } else {
    const currency = await getCurrencyByUid(currencyUid);

    if (!currency) {
      throw Error('Currency not found');
    }

    await insertAsset(wallet.uid, {
      amount,
      currency: {
        uid: currency.uid,
        name: currency.name,
        symbol: currency.symbol,
        logo: currency.logo,
        sign: currency.sign,
        cmcId: currency.cmcId,
        quote: currency.quote,
        type: currency.type,
      },
      reserved: 0,
    });
  }
};
