import { v4 as uuidv4 } from 'uuid';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/admin-config';
import { ExchangeConverter } from '@libs/firebase/converters/exchangeConverter';

interface InsertExchange {
  cmcId: number;
  name: string;
  slug: string;
  logo: string;
}

const insertExchange = async (newExchange: InsertExchange) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const ExchangeDoc = firestore()
    .collection(FirebaseCollections.EXCHANGES)
    .doc(uid)
    .withConverter(ExchangeConverter);

  await ExchangeDoc.set({
    uid,
    ...newExchange,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  const insertedExchange = await ExchangeDoc.get().then((snapshot) =>
    snapshot.data()
  );

  return insertedExchange;
};

export default insertExchange;
