import { PresaleNFT } from '@contracts/presale/nft/PresaleCoin';
import { User } from '@contracts/User';

import { createWallet } from '@services/api/wallet/createWallet';

import { removeApiUrl } from '@utils/removeApiUrl';

import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';
import getAssetByCurrencyUid from '@libs/firebase/functions/wallet/asset/getAssetByCurrencyUid';
import insertPresaleOrder from '@libs/firebase/functions/presale/nft/order/insertOrder';
import getFeeByType from '@libs/firebase/functions/fee/getFeeByType';
import insertPresaleAsset from '@libs/firebase/functions/wallet/presaleNFTAsset/insertAsset';
import insertAsset from '@libs/firebase/functions/wallet/asset/insertAsset';
import getSuperAdmin from '@libs/firebase/functions/users/getSuperAdmin';
import getCurrencyByUid from '@libs/firebase/functions/currency/getCurrencyByUid';
import updateAsset from '@libs/firebase/functions/wallet/asset/updateAsset';
import { increment } from '@libs/firebase/admin-config';
import updateToken from '@libs/firebase/functions/presale/nft/token/updateToken';

interface CreateTransaction {
  presaleNFT: PresaleNFT;
  user: User;
  amount: number;
}
export const createTransaction = async ({
  presaleNFT,
  user,
  amount,
}: CreateTransaction) => {
  const assetAmount = presaleNFT.quote * amount;

  const fee = await getFeeByType('GLOBAL');
  if (!fee) {
    throw Error('Fee not found');
  }
  const { percentage: feePercentage } = fee;

  const valueToAdmin = assetAmount * feePercentage;
  const valueToUser = assetAmount + valueToAdmin;

  if (presaleNFT.amountAvailable === 0 || presaleNFT.amountAvailable < amount) {
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

  const currency = await getCurrencyByUid(presaleNFT.baseCurrency.uid);
  if (!currency) {
    throw new Error('Currency not found');
  }

  const adminAssetPromise = getAssetByCurrencyUid(
    adminWallet.uid,
    presaleNFT.baseCurrency.uid
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
    presaleNFT.baseCurrency.uid
  );

  const [adminAsset, userAsset] = await Promise.all([
    adminAssetPromise,
    userAssetPromise,
  ]);

  if (!adminAsset) {
    throw new Error('Admin asset not found');
  }
  if (
    !userAsset ||
    userAsset.amount < assetAmount ||
    userAsset.amount < valueToUser
  ) {
    throw new Error('Not enough coins');
  }

  await insertPresaleOrder({
    amount,
    nft: {
      author: presaleNFT.author,
      baseCurrency: {
        cmcId: presaleNFT.baseCurrency.cmcId,
        logo: removeApiUrl(presaleNFT.baseCurrency).logo,
        name: presaleNFT.baseCurrency.name,
        symbol: presaleNFT.baseCurrency.symbol,
        type: presaleNFT.baseCurrency.type,
        uid: presaleNFT.baseCurrency.uid,
      },
      description: presaleNFT.description,
      quote: presaleNFT.quote,
      icon: removeApiUrl({
        logo: presaleNFT.icon,
      }).logo,
      name: presaleNFT.name,
      uid: presaleNFT.uid,
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

  await Promise.all([
    updateAsset(adminWallet.uid, adminAsset.uid, {
      amount: increment(valueToAdmin),
    }),
    updateAsset(userWallet.uid, userAsset.uid, {
      amount: increment(-valueToUser),
    }),
    updateToken(presaleNFT.uid, {
      amountAvailable: increment(-amount),
    }),
  ]);

  for await (let item of Array(amount)) {
    item = userWallet.uid;

    await insertPresaleAsset(item, {
      nft: {
        author: presaleNFT.author,
        baseCurrency: {
          cmcId: presaleNFT.baseCurrency.cmcId,
          logo: removeApiUrl(presaleNFT.baseCurrency).logo,
          name: presaleNFT.baseCurrency.name,
          symbol: presaleNFT.baseCurrency.symbol,
          type: presaleNFT.baseCurrency.type,
          uid: presaleNFT.baseCurrency.uid,
        },
        description: presaleNFT.description,
        icon: removeApiUrl({
          logo: presaleNFT.icon,
        }).logo,
        name: presaleNFT.name,
        quote: presaleNFT.quote,
        uid: presaleNFT.uid,
      },
    });
  }
};
