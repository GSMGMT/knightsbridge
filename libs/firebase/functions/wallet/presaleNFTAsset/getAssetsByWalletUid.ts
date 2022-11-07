import { PresaleAsset } from '@contracts/presale/nft/PresaleAsset';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleAssetConverter } from '@libs/firebase/converters/presale/nft/presaleAssetConverter';
import { firestore } from '@libs/firebase/admin-config';

const getAssetsByWalletUid = async (
  walletUid: string
): Promise<PresaleAsset[]> => {
  const WalletAssetCollection = firestore()
    .collection(FirebaseCollections.WALLETS)
    .doc(walletUid)
    .collection(FirebaseCollections.NFT_PRESALE_ASSETS)
    .withConverter(PresaleAssetConverter);

  const querySnapshot = await WalletAssetCollection.get();

  const assets: PresaleAsset[] = [];

  querySnapshot.forEach((doc) => assets.push(doc.data()));

  return assets;
};

export default getAssetsByWalletUid;