import { firestore } from '@libs/firebase/admin-config';
import { PresaleAsset } from '@contracts/PresaleAsset';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleAssetConverter } from '@libs/firebase/converters/presaleAssetConverter';

const getAssetByCoinUid = async (
  walletUid: string,
  coinUid: string
): Promise<PresaleAsset | null> => {
  const WalletAssetCollection = firestore()
    .collection(FirebaseCollections.WALLETS)
    .doc(walletUid)
    .collection(FirebaseCollections.PRESALE_ASSETS)
    .where('coin.uid', '==', coinUid)
    .withConverter(PresaleAssetConverter);

  const querySnapshot = await WalletAssetCollection.get();

  return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
};

export default getAssetByCoinUid;
