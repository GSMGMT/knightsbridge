import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { firestore } from '@libs/firebase/config';
import { FirebaseCollections } from '@libs/firebase/collections';

interface InsertCurrency {
  name: string;
  code: string;
  logo: string;
  symbol: string;
  cmcId: number;
  quote: number;
}

const insertCurrency = async (newCurrency: InsertCurrency) => {
  const FiatCurrencyCollection = collection(
    firestore,
    FirebaseCollections.FIAT_CURRENCY
  );

  const serverTime = serverTimestamp();
  await addDoc(FiatCurrencyCollection, {
    ...newCurrency,
    createdAt: serverTime,
    updatedAt: serverTime,
  });
};

export default insertCurrency;
