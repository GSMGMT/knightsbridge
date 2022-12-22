import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/admin-config';
import { StockAssetConverter } from '@libs/firebase/converters/stockAssetConverter';
import { StockAsset } from '@contracts/StockAsset';

const getAssetsByWalletUid = async (
  walletUid: string
): Promise<StockAsset[]> => {
  const WalletAssetCollection = firestore()
    .collection(FirebaseCollections.WALLETS)
    .doc(walletUid)
    .collection(FirebaseCollections.STOCK_ASSETS)
    .withConverter(StockAssetConverter);

  const querySnapshot = await WalletAssetCollection.get();

  const assets: StockAsset[] = [];

  querySnapshot.forEach((doc) => assets.push(doc.data()));

  return assets;
};

export default getAssetsByWalletUid;
