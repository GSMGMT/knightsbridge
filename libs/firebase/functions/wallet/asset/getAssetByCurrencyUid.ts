import { Asset } from '@contracts/Wallet';
import { FirebaseCollections } from '@libs/firebase/collections';
import { AssetConverter } from '@libs/firebase/converters/assetConverter';
import { firestore } from '@libs/firebase-admin/config';

const getAssetByCurrencyUid = async (
  walletUid: string,
  currencyUid: string
): Promise<Asset | null> => {
  const WalletAssetCollection = firestore()
    .collection(FirebaseCollections.WALLETS)
    .doc(walletUid)
    .collection(FirebaseCollections.ASSETS)
    .where('currency.uid', '==', currencyUid)
    .withConverter(AssetConverter);

  const querySnapshot = await WalletAssetCollection.get();

  return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
};

export default getAssetByCurrencyUid;
