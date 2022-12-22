import { firestore } from 'firebase-admin';

import { FirebaseCollections } from '@libs/firebase/collections';
import { StockAssetConverter } from '@libs/firebase/converters/stockAssetConverter';
import { StockAsset } from '@contracts/StockAsset';

type UpdateFields = Partial<
  Omit<StockAsset, 'createdAt' | 'uid' | 'amount' | 'reserved'>
> & {
  amount?: firestore.FieldValue;
  reserved?: firestore.FieldValue;
};

const updateAsset = async (
  walletUid: string,
  assetUid: string,
  fieldsToUpdate: UpdateFields
) => {
  const serverTime = firestore.FieldValue.serverTimestamp();

  const AssetDoc = firestore()
    .collection(FirebaseCollections.WALLETS)
    .doc(walletUid)
    .collection(FirebaseCollections.STOCK_ASSETS)
    .doc(assetUid)
    .withConverter(StockAssetConverter);

  await firestore().runTransaction(async (transaction) => {
    transaction.update(AssetDoc, {
      ...fieldsToUpdate,
      updatedAt: serverTime,
    });
  });
};

export default updateAsset;
