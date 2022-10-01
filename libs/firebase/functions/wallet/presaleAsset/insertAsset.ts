import { v4 as uuidv4 } from 'uuid';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/admin-config';
import { OmitTimestamp } from '@utils/types';
import { PresaleAsset as Asset } from '@contracts/PresaleAsset';
import { PresaleAssetConverter } from '@libs/firebase/converters/presaleAssetConverter';
import { PresaleCoin } from '@contracts/PresaleCoin';

interface InsertAsset {
  amount: number;
  coin: OmitTimestamp<PresaleCoin>;
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
    .collection(FirebaseCollections.PRESALE_ASSETS)
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
