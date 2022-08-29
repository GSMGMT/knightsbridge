import { doc, getDoc } from 'firebase/firestore';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { FiatCurrencyConverter } from '@libs/firebase/converters/fiatCurrencyConverter';
import { FiatCurrency } from '@contracts/FiatCurrency';

const getCurrencyById = async (
  uid: string
): Promise<FiatCurrency | undefined> => {
  const DocRef = doc(
    firestore,
    FirebaseCollections.FIAT_CURRENCIES,
    uid
  ).withConverter(FiatCurrencyConverter);
  const DocSnap = await getDoc(DocRef);

  return DocSnap.data();
};

export default getCurrencyById;
