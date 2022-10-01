import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleCoinConverter } from '@libs/firebase/converters/presaleCoinConverter';

export const getPresaleCoinByUid = async (uid: string) => {
  const CoinDoc = firestore()
    .collection(FirebaseCollections.PRESALE_COINS)
    .doc(uid)
    .withConverter(PresaleCoinConverter);

  const coin = await CoinDoc.get();

  return coin.data();
};
