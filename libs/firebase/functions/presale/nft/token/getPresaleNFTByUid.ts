import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleConverter } from '@libs/firebase/converters/presale/nft/presaleConverter';

export const getPresaleNFTByUid = async (uid: string) => {
  const NFTDoc = firestore()
    .collection(FirebaseCollections.NFT_PRESALE_TOKENS)
    .doc(uid)
    .withConverter(PresaleConverter);

  const nft = await NFTDoc.get();

  return nft.data();
};
