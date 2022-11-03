import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleConverter } from '@libs/firebase/converters/presale/currency/presaleConverter';

export const getPresaleCoinByUid = async (uid: string) => {
  const CoinDoc = firestore()
    .collection(FirebaseCollections.PRESALE_COINS)
    .doc(uid)
    .withConverter(PresaleConverter);

  const coin = await CoinDoc.get();

  return coin.data();
};
