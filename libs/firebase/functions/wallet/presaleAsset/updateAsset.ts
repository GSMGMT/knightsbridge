import { firestore } from 'firebase-admin';

import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleAssetConverter } from '@libs/firebase/converters/presaleAssetConverter';

type UpdateFields = {
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
    .collection(FirebaseCollections.PRESALE_ASSETS)
    .doc(assetUid)
    .withConverter(PresaleAssetConverter);

  await firestore().runTransaction(async (transaction) => {
    transaction.update(AssetDoc, {
      ...fieldsToUpdate,
      updatedAt: serverTime,
    });
  });
};

export default updateAsset;
