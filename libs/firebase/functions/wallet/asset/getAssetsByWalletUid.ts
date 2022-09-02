import { Asset } from '@contracts/Wallet';
import { FirebaseCollections } from '@libs/firebase/collections';
import { AssetConverter } from '@libs/firebase/converters/assetConverter';
import { firestore } from '@libs/firebase/admin-config';

const getAssetsByWalletUid = async (walletUid: string): Promise<Asset[]> => {
  const WalletAssetCollection = firestore()
    .collection(FirebaseCollections.WALLETS)
    .doc(walletUid)
    .collection(FirebaseCollections.ASSETS)
    .withConverter(AssetConverter);

  const querySnapshot = await WalletAssetCollection.get();

  const assets: Asset[] = [];

  querySnapshot.forEach((doc) => assets.push(doc.data()));

  return assets;
};

export default getAssetsByWalletUid;
