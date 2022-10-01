import { PresaleCoin } from '@contracts/PresaleCoin';
import { User } from '@contracts/User';

import { createWallet } from '@services/api/wallet/createWallet';

import { removeApiUrl } from '@utils/removeApiUrl';

import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';
import getAssetByCurrencyUid from '@libs/firebase/functions/wallet/asset/getAssetByCurrencyUid';
import insertPresaleOrder from '@libs/firebase/functions/presale/order/insertOrder';
import getFeeByType from '@libs/firebase/functions/fee/getFeeByType';
import getAssetByCoinUid from '@libs/firebase/functions/wallet/presaleAsset/getAssetByCurrencyUid';
import insertPresaleAsset from '@libs/firebase/functions/wallet/presaleAsset/insertAsset';
import insertAsset from '@libs/firebase/functions/wallet/asset/insertAsset';
import getSuperAdmin from '@libs/firebase/functions/users/getSuperAdmin';
import getCurrencyByUid from '@libs/firebase/functions/currency/getCurrencyByUid';
import updateAsset from '@libs/firebase/functions/wallet/asset/updateAsset';
import updatePresaleAsset from '@libs/firebase/functions/wallet/presaleAsset/updateAsset';
import { increment } from '@libs/firebase/admin-config';
import updateCoin from '@libs/firebase/functions/presale/coin/updateCoin';

interface CreateTransaction {
  amount: number;
  presaleCoin: PresaleCoin;
  user: User;
}
export const createTransaction = async ({
  presaleCoin,
  amount,
  user,
}: CreateTransaction) => {
  const assetAmount = amount * presaleCoin.quote;

  const fee = await getFeeByType('GLOBAL');
  if (!fee) {
    throw Error('Fee not found');
  }
  const { percentage: feePercentage } = fee;

  if (presaleCoin.amount < amount) {
    throw new Error('Not enough coins');
  }

  const { uid: adminUid } = await getSuperAdmin();
  const adminWalletPromise = getWalletByUserUid(adminUid).then(
    (wallet) => wallet || createWallet(adminUid)
  );

  const userWalletPromise = getWalletByUserUid(user.uid).then(
    (wallet) => wallet || createWallet(user.uid)
  );

  const [adminWallet, userWallet] = await Promise.all([
    adminWalletPromise,
    userWalletPromise,
  ]);
  if (!userWallet || !adminWallet) {
    throw new Error('Wallet not found');
  }

  const currency = await getCurrencyByUid(presaleCoin.baseCurrency.uid);
  if (!currency) {
    throw new Error('Currency not found');
  }

  const adminAssetPromise = getAssetByCurrencyUid(
    adminWallet.uid,
    presaleCoin.baseCurrency.uid
  ).then(
    (asset) =>
      asset ||
      insertAsset(adminWallet.uid, {
        amount: 0,
        reserved: 0,
        currency: {
          uid: currency.uid,
          name: currency.name,
          cmcId: currency.cmcId,
          logo: removeApiUrl(currency).logo,
          symbol: currency.symbol,
          type: currency.type,
          deposit: currency.deposit,
          quote: currency.quote,
          sign: currency.sign,
        },
      })
  );
  const userAssetPromise = getAssetByCurrencyUid(
    userWallet.uid,
    presaleCoin.baseCurrency.uid
  );
  const userPresaleAssetPromise = getAssetByCoinUid(
    userWallet.uid,
    presaleCoin.uid
  ).then(
    (asset) =>
      asset ||
      insertPresaleAsset(userWallet.uid, {
        amount: 0,
        coin: {
          amount: presaleCoin.amount,
          availableAt: presaleCoin.availableAt,
          baseCurrency: {
            cmcId: presaleCoin.baseCurrency.cmcId,
            logo: removeApiUrl(presaleCoin.baseCurrency).logo,
            name: presaleCoin.baseCurrency.name,
            symbol: presaleCoin.baseCurrency.symbol,
            type: presaleCoin.baseCurrency.type,
            uid: presaleCoin.baseCurrency.uid,
          },
          icon: removeApiUrl({
            logo: presaleCoin.icon,
          }).logo,
          name: presaleCoin.name,
          quote: presaleCoin.quote,
          symbol: presaleCoin.symbol,
          uid: presaleCoin.uid,
        },
      })
  );

  const [adminAsset, userAsset, userPresaleAsset] = await Promise.all([
    adminAssetPromise,
    userAssetPromise,
    userPresaleAssetPromise,
  ]);

  if (!adminAsset) {
    throw new Error('Admin asset not found');
  }
  if (!userAsset || userAsset.amount < assetAmount) {
    throw new Error('Not enough coins');
  }
  if (!userPresaleAsset) {
    throw new Error('User presale asset not found');
  }

  await insertPresaleOrder({
    amount,
    coin: {
      amount: presaleCoin.amount,
      availableAt: presaleCoin.availableAt,
      baseCurrency: {
        cmcId: presaleCoin.baseCurrency.cmcId,
        logo: removeApiUrl(presaleCoin.baseCurrency).logo,
        name: presaleCoin.baseCurrency.name,
        symbol: presaleCoin.baseCurrency.symbol,
        type: presaleCoin.baseCurrency.type,
        uid: presaleCoin.baseCurrency.uid,
      },
      quote: presaleCoin.quote,
      icon: removeApiUrl({
        logo: presaleCoin.icon,
      }).logo,
      name: presaleCoin.name,
      symbol: presaleCoin.symbol,
      uid: presaleCoin.uid,
    },
    fee: feePercentage,
    user: {
      email: user.email,
      uid: user.uid,
      name: user.name,
      role: user.role,
      surname: user.surname,
    },
  });

  const valueToAdmin = assetAmount * feePercentage;
  const valueToUser = amount * (1 - feePercentage);

  await Promise.all([
    updateAsset(adminWallet.uid, adminAsset.uid, {
      amount: increment(valueToAdmin),
    }),
    updateAsset(userWallet.uid, userAsset.uid, {
      amount: increment(-assetAmount),
    }),
    updatePresaleAsset(userWallet.uid, userPresaleAsset.uid, {
      amount: increment(valueToUser),
    }),
    updateCoin(presaleCoin.uid, {
      amount: increment(-valueToUser),
    }),
  ]);
};
