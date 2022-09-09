import { v4 as uuidv4 } from 'uuid';

import { CurrencyType } from '@contracts/Currency';
import { FirebaseCollections } from '@libs/firebase/collections';
import { CurrencyConverter } from '@libs/firebase/converters/currencyConverter';
import { firestore } from '@libs/firebase/admin-config';

interface InsertCurrency {
  name: string;
  symbol: string;
  logo: string;
  sign?: string;
  cmcId: number;
  quote?: number;
  type: CurrencyType;
}

const insertCurrency = async (newCurrency: InsertCurrency) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const CurrencyDoc = firestore()
    .collection(FirebaseCollections.CURRENCIES)
    .doc(uid)
    .withConverter(CurrencyConverter);

  await CurrencyDoc.set({
    uid,
    ...newCurrency,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  const insertedCurrency = await CurrencyDoc.get().then((snapshot) =>
    snapshot.data()
  );

  return insertedCurrency;
};

export default insertCurrency;
