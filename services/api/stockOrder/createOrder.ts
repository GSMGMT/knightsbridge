import { User } from '@contracts/User';

import getFeeByType from '@libs/firebase/functions/fee/getFeeByType';
import getStockPairByUid from '@libs/firebase/functions/stockPair/getStockPairByUid';
import getStockAssetsByWalletUid from '@libs/firebase/functions/wallet/stockAsset/getAssetsByWalletUid';
import getCryptoAssetsByWalletUid from '@libs/firebase/functions/wallet/asset/getAssetsByWalletUid';
import updateStockAsset from '@libs/firebase/functions/wallet/stockAsset/updateAsset';
import updateCryptoAsset from '@libs/firebase/functions/wallet/asset/updateAsset';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';
import { increment } from '@libs/firebase/admin-config';
import insertOrder from '@libs/firebase/functions/stockOrder/insertOrder';

import { createWallet } from '../wallet/createWallet';
import { getStockPairPrice } from '../stock/getStockPairPrice';

interface CreateOrder {
  user: User;
  type: 'buy' | 'sell';
  stockPairId: string;
  amount: number;
}

export const createStockOrder = async ({
  user,
  type,
  stockPairId,
  amount,
}: CreateOrder) => {
  const stockPair = await getStockPairByUid(stockPairId!);

  if (!stockPair) {
    throw Error('Could not find any market pair with given ID');
  }

  if (!stockPair.enabled) {
    throw Error('Market pair is disabled');
  }

  const feePromise = getFeeByType('GLOBAL');
  const walletPromise = getWalletByUserUid(user.uid).then(
    (wallet) => wallet || createWallet(user.uid)
  );

  const [wallet, fee] = await Promise.all([walletPromise, feePromise]);

  if (!fee) {
    throw Error('Could not find any fee register');
  }

  if (!wallet) {
    throw Error('Could not find user wallet');
  }

  const stockAssetsPromise = getStockAssetsByWalletUid(wallet.uid);
  const cryptoAssetsPromise = getCryptoAssetsByWalletUid(wallet.uid);

  const [stockAssets, cryptoAssets] = await Promise.all([
    stockAssetsPromise,
    cryptoAssetsPromise,
  ]);

  const currency = new Map(
    Object.entries({
      buy: stockPair.crypto.uid,
      sell: stockPair.stock.uid,
    })
  );

  const desiredAsset =
    type === 'buy'
      ? cryptoAssets.find((asset) => asset.currency.uid === currency.get(type))
      : stockAssets.find((asset) => asset.stock.uid === currency.get(type));

  if (!desiredAsset) {
    throw Error('Insufficient fund');
  }

  const { amount: fund, reserved } = desiredAsset;

  const pairPrice = await getStockPairPrice(stockPair.uid);

  const price = pairPrice;

  if (!price) {
    throw Error('Was not able to get most recent pair price');
  }

  const desireAmountOptions = new Map(
    Object.entries({
      buy: price * amount,
      sell: amount,
    })
  );

  const desireAmount = desireAmountOptions.get(type) as number;

  if (!wallet || desireAmount > fund - reserved) {
    throw Error('Insufficient fund');
  }

  if (type === 'buy')
    await updateCryptoAsset(wallet.uid, desiredAsset.uid, {
      reserved: increment(desireAmount),
    });
  else
    await updateStockAsset(wallet.uid, desiredAsset.uid, {
      reserved: increment(desireAmount),
    });

  return insertOrder({
    amount,
    fee: fee.percentage,
    stockPair,
    price,
    total: price * amount,
    type,
    user,
  });
};
