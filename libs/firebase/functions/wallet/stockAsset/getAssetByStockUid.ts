import { StockAsset } from '@contracts/StockAsset';
import { FirebaseCollections } from '@libs/firebase/collections';
import { StockAssetConverter } from '@libs/firebase/converters/stockAssetConverter';
import { firestore } from '@libs/firebase/admin-config';

const getAssetByCurrencyUid = async (
  walletUid: string,
  stockUid: string
): Promise<StockAsset | null> => {
  const WalletAssetCollection = firestore()
    .collection(FirebaseCollections.WALLETS)
    .doc(walletUid)
    .collection(FirebaseCollections.STOCK_ASSETS)
    .where('stock.uid', '==', stockUid)
    .withConverter(StockAssetConverter);

  const querySnapshot = await WalletAssetCollection.get();

  return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
};

export default getAssetByCurrencyUid;
