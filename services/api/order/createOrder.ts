import { User } from '@contracts/User';
import getFeeByType from '@libs/firebase/functions/fee/getFeeByType';
import getMarketPairByUid from '@libs/firebase/functions/marketPair/getMarketPairByUid';
import getAssetsByWalletUid from '@libs/firebase/functions/wallet/asset/getAssetsByWalletUid';
import updateAsset from '@libs/firebase/functions/wallet/asset/updateAsset';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';
import { increment } from '@libs/firebase/admin-config';
import insertOrder from '@libs/firebase/functions/order/insertOrder';
import { getPairPrice } from '../coinMarketCap/marketPair/getMarketPairPrice';
import { createWallet } from '../wallet/createWallet';

interface CreateOrder {
  user: User;
  type: 'buy' | 'sell';
  marketPairId: string;
  amount: number;
}

export const createOrder = async ({
  user,
  type,
  marketPairId,
  amount,
}: CreateOrder) => {
  const marketPair = await getMarketPairByUid(marketPairId);

  if (!marketPair) {
    throw Error('Could not find any market pair with given ID');
  }

  if (!marketPair.enabled) {
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

  const assets = await getAssetsByWalletUid(wallet.uid);

  const currency = new Map(
    Object.entries({
      buy: marketPair.quote.uid,
      sell: marketPair.base.uid,
    })
  );

  const desiredAsset = assets.find(
    (asset) => asset.currency.uid === currency.get(type)
  );

  if (!desiredAsset) {
    throw Error('Insufficient fund');
  }

  const { amount: fund, reserved } = desiredAsset;

  const { price } = await getPairPrice(marketPair);

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

  await updateAsset(wallet.uid, desiredAsset.uid, {
    reserved: increment(desireAmount),
  });

  return insertOrder({
    amount,
    fee: fee.percentage,
    marketPair,
    price,
    total: price * amount,
    type,
    user,
  });
};
