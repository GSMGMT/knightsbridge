import { firestore, database } from 'firebase-admin';

import { Asset } from '@contracts/Wallet';
import { FirebaseCollections } from '@libs/firebase/collections';
import { AssetConverter } from '@libs/firebase/converters/assetConverter';

type UpdateFields = Partial<Omit<Asset, 'createdAt' | 'uid' | 'amount'>> & {
  amount?: firestore.FieldValue;
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
    .collection(FirebaseCollections.ASSETS)
    .doc(assetUid)
    .withConverter(AssetConverter);

  await firestore().runTransaction(async (transaction) => {
    transaction.update(AssetDoc, {
      ...fieldsToUpdate,
      updatedAt: serverTime,
    });
  });
};

export default updateAsset;
