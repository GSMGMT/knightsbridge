import getAssetByStockUid from '@libs/firebase/functions/wallet/stockAsset/getAssetByStockUid';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';

export const stockBalance = async (userUid: string, stockUid: string) => {
  const wallet = await getWalletByUserUid(userUid);

  if (!wallet) {
    return 0.0;
  }

  const asset = await getAssetByStockUid(wallet.uid, stockUid);

  if (!asset) {
    return 0.0;
  }

  const { amount, reserved } = asset;

  const balance = amount - reserved;

  return balance;
};
