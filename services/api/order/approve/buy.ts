import { Order, OrderStatus } from '@contracts/Order';

import { increment } from '@libs/firebase/admin-config';
import updateOrder from '@libs/firebase/functions/order/updateOrder';
import getSuperAdmin from '@libs/firebase/functions/users/getSuperAdmin';
import getAssetByCurrencyUid from '@libs/firebase/functions/wallet/asset/getAssetByCurrencyUid';
import getAssetsByWalletUid from '@libs/firebase/functions/wallet/asset/getAssetsByWalletUid';
import insertAsset from '@libs/firebase/functions/wallet/asset/insertAsset';
import updateAsset from '@libs/firebase/functions/wallet/asset/updateAsset';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';

import { createWallet } from '@services/api/wallet/createWallet';

export const approveOrderBuy = async (order: Order) => {
  const {
    user: { uid: userUid },
    marketPair: { quote: quoteCurrency, base: baseCurrency },
    total,
    fee,
    amount,
    uid: orderUid,
  } = order;
  const { uid: quoteUid } = quoteCurrency;
  const { uid: baseUid } = baseCurrency;

  const { uid: adminUid } = await getSuperAdmin();
  const adminWalletPromise = getWalletByUserUid(adminUid).then(
    (wallet) => wallet || createWallet(adminUid)
  );

  const userWalletPromise = getWalletByUserUid(userUid).then(
    (wallet) => wallet || createWallet(userUid)
  );

  const [adminWallet, userWallet] = await Promise.all([
    adminWalletPromise,
    userWalletPromise,
  ]);

  if (!adminWallet || !userWallet) {
    throw Error('Wallet not found');
  }

  const adminAssetPromise = getAssetByCurrencyUid(
    adminWallet.uid,
    quoteUid
  ).then(
    (asset) =>
      asset ||
      insertAsset(adminWallet.uid, {
        amount: 0,
        reserved: 0,
        currency: quoteCurrency,
      })
  );

  const userAssetsPromise = getAssetsByWalletUid(userWallet.uid);

  const [adminAsset, userAssets] = await Promise.all([
    adminAssetPromise,
    userAssetsPromise,
  ]);

  const userQuoteAssetPromise =
    userAssets.find((asset) => asset.currency.uid === quoteUid) ||
    (await insertAsset(userWallet.uid, {
      amount: 0,
      reserved: 0,
      currency: quoteCurrency,
    }));
  const userBaseAssetPromise =
    userAssets.find((asset) => asset.currency.uid === baseUid) ||
    (await insertAsset(userWallet.uid, {
      amount: 0,
      reserved: 0,
      currency: baseCurrency,
    }));

  const [userQuoteAsset, userBaseAsset] = await Promise.all([
    userQuoteAssetPromise,
    userBaseAssetPromise,
  ]);

  if (!adminAsset || !userBaseAsset || !userQuoteAsset) {
    throw Error('Asset not found');
  }

  const valueToAdmin = total * fee;
  const valueToUser = amount * (1 - fee);

  await Promise.all([
    updateAsset(userWallet.uid, userQuoteAsset.uid, {
      amount: increment(-total),
      reserved: increment(-total),
    }),
    updateAsset(userWallet.uid, userBaseAsset.uid, {
      amount: increment(valueToUser),
    }),
    updateAsset(adminWallet.uid, adminAsset.uid, {
      amount: increment(valueToAdmin),
    }),
    updateOrder(orderUid, {
      status: OrderStatus.APPROVED,
    }),
  ]);
};
