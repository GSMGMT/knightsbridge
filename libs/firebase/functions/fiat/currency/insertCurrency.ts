import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { firestore } from '@libs/firebase/config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { FiatCurrencyConverter } from '@libs/firebase/converters/fiatCurrencyConverter';

interface InsertCurrency {
  name: string;
  code: string;
  logo: string;
  symbol: string;
  cmcId: number;
  quote: number;
}

const insertCurrency = async (newCurrency: InsertCurrency) => {
  const uid = uuidv4();
  const serverTime = serverTimestamp();

  const CurrencyDoc = doc(
    firestore,
    FirebaseCollections.FIAT_CURRENCIES,
    uid
  ).withConverter(FiatCurrencyConverter);

  await setDoc(CurrencyDoc, {
    uid,
    ...newCurrency,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  const insertedFiatCurrency = await getDoc(CurrencyDoc);

  return insertedFiatCurrency.data();
};

export default insertCurrency;
