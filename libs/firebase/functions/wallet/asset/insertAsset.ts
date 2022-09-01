import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
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

  const WalletAssetDoc = doc(
    firestore,
    FirebaseCollections.WALLETS,
    walletUid,
    FirebaseCollections.ASSETS,
    uid
  ).withConverter(AssetConverter);

  await setDoc(WalletAssetDoc, {
    uid,
    ...newAsset,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  const insertedAsset = await getDoc(WalletAssetDoc);

  return insertedAsset.data();
};

export default insertAsset;
