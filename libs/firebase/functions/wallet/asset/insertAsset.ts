import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { Currency } from '@contracts/Currency';
import { OmitTimestamp } from '@utils/types';
import { AssetConverter } from '@libs/firebase/converters/assetConverter';

interface InsertAsset {
  amount: number;
  reserved: number;
  currency: OmitTimestamp<Currency>;
}

const insertAsset = async (walletUid: string, newAsset: InsertAsset) => {
  const uid = uuidv4();
  const serverTime = serverTimestamp();

  const WalletAssetCollection = collection(
    firestore,
    FirebaseCollections.WALLETS,
    walletUid,
    'assets'
  ).withConverter(AssetConverter);

  const insertedAsset = await addDoc(WalletAssetCollection, {
    uid,
    ...newAsset,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  return insertedAsset;
};

export default insertAsset;
