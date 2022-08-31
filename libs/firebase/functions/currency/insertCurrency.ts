import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { firestore } from '@libs/firebase/config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { CurrencyConverter } from '@libs/firebase/converters/currencyConverter';
import { CurrencyType } from '@contracts/Currency';

interface InsertCurrency {
  name: string;
  symbol: string;
  logo: string;
  sign?: string;
  cmcId: number;
  quote: number;
  type: CurrencyType;
}

const insertCurrency = async (newCurrency: InsertCurrency) => {
  const uid = uuidv4();
  const serverTime = serverTimestamp();

  const CurrencyDoc = doc(
    firestore,
    FirebaseCollections.CURRENCIES,
    uid
  ).withConverter(CurrencyConverter);

  await setDoc(CurrencyDoc, {
    uid,
    ...newCurrency,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  const insertedCurrency = await getDoc(CurrencyDoc);

  return insertedCurrency.data();
};

export default insertCurrency;
