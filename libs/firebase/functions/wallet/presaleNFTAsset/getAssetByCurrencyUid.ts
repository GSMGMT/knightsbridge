import { firestore } from '@libs/firebase/admin-config';
import { PresaleAsset } from '@contracts/presale/nft/PresaleAsset';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleAssetConverter } from '@libs/firebase/converters/presale/nft/presaleAssetConverter';

const getAssetByCoinUid = async (
  walletUid: string,
  nftUid: string
): Promise<PresaleAsset | null> => {
  const WalletAssetCollection = firestore()
    .collection(FirebaseCollections.WALLETS)
    .doc(walletUid)
    .collection(FirebaseCollections.NFT_PRESALE_ASSETS)
    .where('nft.uid', '==', nftUid)
    .withConverter(PresaleAssetConverter);

  const querySnapshot = await WalletAssetCollection.get();

  return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
};

export default getAssetByCoinUid;
