import { Currency } from '@contracts/Currency';
import { FirebaseCollections } from '@libs/firebase/collections';
import { CurrencyConverter } from '@libs/firebase/converters/currencyConverter';
import { firestore } from '@libs/firebase/admin-config';

const getCurrencyByUid = async (uid: string): Promise<Currency | undefined> => {
  const CurrencyDoc = firestore()
    .collection(FirebaseCollections.CURRENCIES)
    .doc(uid)
    .withConverter(CurrencyConverter);

  const DocSnap = await CurrencyDoc.get();

  return DocSnap.data();
};

export default getCurrencyByUid;
