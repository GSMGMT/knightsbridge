import { v4 as uuidv4 } from 'uuid';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/admin-config';
import {
  PresaleAsset as Asset,
  NFT as PresaleNFT,
} from '@contracts/presale/nft/PresaleAsset';
import { PresaleAssetConverter } from '@libs/firebase/converters/presale/nft/presaleAssetConverter';

interface InsertAsset {
  nft: PresaleNFT;
}

const insertAsset: (
  walletUid: string,
  newAsset: InsertAsset
) => Promise<Asset | undefined> = async (walletUid, newAsset) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const WalletAssetDoc = firestore()
    .collection(FirebaseCollections.WALLETS)
    .doc(walletUid)
    .collection(FirebaseCollections.NFT_PRESALE_ASSETS)
    .doc(uid)
    .withConverter(PresaleAssetConverter);

  await WalletAssetDoc.set({
    uid,
    ...newAsset,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  return (await WalletAssetDoc.get()).data();
};

export default insertAsset;
