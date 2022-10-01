import { firestore } from 'firebase-admin';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleCoinConverter } from '@libs/firebase/converters/presaleCoinConverter';

type UpdateFields = {
  amount?: firestore.FieldValue;
};
const updateCoin = async (coinUid: string, fieldsToUpdate: UpdateFields) => {
  const serverTime = firestore.FieldValue.serverTimestamp();

  const CoinDoc = firestore()
    .collection(FirebaseCollections.PRESALE_COINS)
    .doc(coinUid)
    .withConverter(PresaleCoinConverter);

  await firestore().runTransaction(async (transaction) => {
    transaction.update(CoinDoc, {
      ...fieldsToUpdate,
      updatedAt: serverTime,
    });
  });
};

export default updateCoin;
