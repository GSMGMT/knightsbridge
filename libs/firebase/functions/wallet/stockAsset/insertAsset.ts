import { v4 as uuidv4 } from 'uuid';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/admin-config';
import { OmitTimestamp } from '@utils/types';
import { StockAssetConverter } from '@libs/firebase/converters/stockAssetConverter';
import { StockAsset } from '@contracts/StockAsset';
import { Stock } from '@contracts/Stock';

interface InsertAsset {
  amount: number;
  reserved: number;
  stock: OmitTimestamp<Stock>;
}

const insertAsset: (
  walletUid: string,
  newAsset: InsertAsset
) => Promise<StockAsset | undefined> = async (walletUid, newAsset) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const WalletAssetDoc = firestore()
    .collection(FirebaseCollections.WALLETS)
    .doc(walletUid)
    .collection(FirebaseCollections.STOCK_ASSETS)
    .doc(uid)
    .withConverter(StockAssetConverter);

  await WalletAssetDoc.set({
    uid,
    ...newAsset,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  return (await WalletAssetDoc.get()).data();
};

export default insertAsset;
