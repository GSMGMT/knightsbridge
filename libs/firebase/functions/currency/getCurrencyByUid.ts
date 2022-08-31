import { doc, getDoc } from 'firebase/firestore';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { CurrencyConverter } from '@libs/firebase/converters/currencyConverter';
import { Currency } from '@contracts/Currency';

const getCurrencyByUid = async (uid: string): Promise<Currency | undefined> => {
  const DocRef = doc(
    firestore,
    FirebaseCollections.CURRENCIES,
    uid
  ).withConverter(CurrencyConverter);
  const DocSnap = await getDoc(DocRef);

  return DocSnap.data();
};

export default getCurrencyByUid;
