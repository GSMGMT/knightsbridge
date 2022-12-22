import { StockOrder, StockOrderStatus } from '@contracts/StockOrder';

import { increment } from '@libs/firebase/admin-config';
import updateOrder from '@libs/firebase/functions/stockOrder/updateOrder';
import getSuperAdmin from '@libs/firebase/functions/users/getSuperAdmin';
import getCryptoAssetByCurrencyUid from '@libs/firebase/functions/wallet/asset/getAssetByCurrencyUid';
import getStockAssetsByWalletUid from '@libs/firebase/functions/wallet/stockAsset/getAssetsByWalletUid';
import getCryptoAssetsByWalletUid from '@libs/firebase/functions/wallet/asset/getAssetsByWalletUid';
import insertStockAsset from '@libs/firebase/functions/wallet/stockAsset/insertAsset';
import insertCryptoAsset from '@libs/firebase/functions/wallet/asset/insertAsset';
import updateStockAsset from '@libs/firebase/functions/wallet/stockAsset/updateAsset';
import updateCryptoAsset from '@libs/firebase/functions/wallet/asset/updateAsset';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';

import { createWallet } from '@services/api/wallet/createWallet';

export const approveOrderBuy = async (order: StockOrder) => {
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

  const adminAssetPromise = getCryptoAssetByCurrencyUid(
    adminWallet.uid,
    cryptoUid
  ).then(
    (asset) =>
      asset ||
      insertCryptoAsset(adminWallet.uid, {
        amount: 0,
        reserved: 0,
        currency: cryptoCurrency,
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

  const valueToAdmin = total * fee;
  const valueToUser = amount * (1 - fee);

  await Promise.all([
    updateCryptoAsset(userWallet.uid, userCryptoAsset.uid, {
      amount: increment(-total),
      reserved: increment(-total),
    }),
    updateStockAsset(userWallet.uid, userStockAsset.uid, {
      amount: increment(valueToUser),
    }),
    updateCryptoAsset(adminWallet.uid, adminAsset.uid, {
      amount: increment(valueToAdmin),
    }),
    updateOrder(orderUid, {
      status: StockOrderStatus.APPROVED,
    }),
  ]);
};
