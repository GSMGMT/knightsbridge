import { firestore } from 'firebase-admin';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleConverter } from '@libs/firebase/converters/presale/nft/presaleConverter';

type UpdateFields = {
  amountAvailable?: firestore.FieldValue;
};
const updateCoin = async (coinUid: string, fieldsToUpdate: UpdateFields) => {
  const serverTime = firestore.FieldValue.serverTimestamp();

  const CoinDoc = firestore()
    .collection(FirebaseCollections.NFT_PRESALE_TOKENS)
    .doc(coinUid)
    .withConverter(PresaleConverter);

  await firestore().runTransaction(async (transaction) => {
    transaction.update(CoinDoc, {
      ...fieldsToUpdate,
      updatedAt: serverTime,
    });
  });
};

export default updateCoin;
