import { StockOrder, StockOrderStatus } from '@contracts/StockOrder';

import { increment } from '@libs/firebase/admin-config';
import updateOrder from '@libs/firebase/functions/stockOrder/updateOrder';
import getSuperAdmin from '@libs/firebase/functions/users/getSuperAdmin';
import getStockAssetByStockUid from '@libs/firebase/functions/wallet/stockAsset/getAssetByStockUid';
import getStockAssetsByWalletUid from '@libs/firebase/functions/wallet/stockAsset/getAssetsByWalletUid';
import getCryptoAssetsByWalletUid from '@libs/firebase/functions/wallet/asset/getAssetsByWalletUid';
import insertStockAsset from '@libs/firebase/functions/wallet/stockAsset/insertAsset';
import insertCryptoAsset from '@libs/firebase/functions/wallet/asset/insertAsset';
import updateStockAsset from '@libs/firebase/functions/wallet/stockAsset/updateAsset';
import updateCryptoAsset from '@libs/firebase/functions/wallet/asset/updateAsset';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';

import { createWallet } from '@services/api/wallet/createWallet';

export const approveOrderSell = async (order: StockOrder) => {
  const {
    user: { uid: userUid },
    stockPair: { crypto: cryptoCurrency, stock },
    total,
    fee,
    amount,
    uid: orderUid,
  } = order;
  const { uid: cryptoUid } = cryptoCurrency;
  const { uid: stockUid } = stock;

  const { uid: adminUid } = await getSuperAdmin();
  const adminWalletPromise = getWalletByUserUid(adminUid).then(
    (wallet) => wallet || createWallet(adminUid)
  );

  const userWalletPromise = await getWalletByUserUid(userUid).then(
    (wallet) => wallet || createWallet(userUid)
  );

  const [adminWallet, userWallet] = await Promise.all([
    adminWalletPromise,
    userWalletPromise,
  ]);

  if (!adminWallet || !userWallet) {
    throw Error('Wallet not found');
  }

  const adminAssetPromise = getStockAssetByStockUid(
    adminWallet.uid,
    stockUid
  ).then(
    (asset) =>
      asset ||
      insertStockAsset(adminWallet.uid, {
        amount: 0,
        reserved: 0,
        stock,
      })
  );

  const userStockAssetsPromise = getStockAssetsByWalletUid(userWallet.uid);
  const userCryptoAssetsPromise = getCryptoAssetsByWalletUid(userWallet.uid);

  const [adminAsset, userStockAssets, userCryptoAssets] = await Promise.all([
    adminAssetPromise,
    userStockAssetsPromise,
    userCryptoAssetsPromise,
  ]);

  const userCryptoAssetPromise =
    userCryptoAssets.find((asset) => asset.currency.uid === cryptoUid) ||
    (await insertCryptoAsset(userWallet.uid, {
      amount: 0,
      reserved: 0,
      currency: cryptoCurrency,
    }));
  const userStockAssetPromise =
    userStockAssets.find((asset) => asset.stock.uid === stockUid) ||
    (await insertStockAsset(userWallet.uid, {
      amount: 0,
      reserved: 0,
      stock,
    }));

  const [userCryptoAsset, userStockAsset] = await Promise.all([
    userCryptoAssetPromise,
    userStockAssetPromise,
  ]);

  if (!adminAsset || !userStockAsset || !userCryptoAsset) {
    throw Error('Asset not found');
  }

  const valueToAdmin = amount * fee;
  const valueToUser = total * (1 - fee);

  await Promise.all([
    await updateStockAsset(userWallet.uid, userStockAsset.uid, {
      amount: increment(-amount),
      reserved: increment(-amount),
    }),
    await updateCryptoAsset(userWallet.uid, userCryptoAsset.uid, {
      amount: increment(valueToUser),
    }),
    await updateStockAsset(adminWallet.uid, adminAsset.uid, {
      amount: increment(valueToAdmin),
    }),
    await updateOrder(orderUid, {
      status: StockOrderStatus.APPROVED,
    }),
  ]);
};
