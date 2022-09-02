import { v4 as uuidv4 } from 'uuid';

import { Currency } from '@contracts/Currency';
import { FirebaseCollections } from '@libs/firebase/collections';
import { AssetConverter } from '@libs/firebase/converters/assetConverter';
import { firestore } from '@libs/firebase-admin/config';
import { OmitTimestamp } from '@utils/types';

interface InsertAsset {
  amount: number;
  reserved: number;
  currency: OmitTimestamp<Currency>;
}

const insertAsset = async (walletUid: string, newAsset: InsertAsset) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const WalletAssetDoc = firestore()
    .collection(FirebaseCollections.WALLETS)
    .doc(walletUid)
    .collection(FirebaseCollections.ASSETS)
    .doc(uid)
    .withConverter(AssetConverter);

  await WalletAssetDoc.set({
    uid,
    ...newAsset,
    createdAt: serverTime,
    updatedAt: serverTime,
  });
};

export default insertAsset;
