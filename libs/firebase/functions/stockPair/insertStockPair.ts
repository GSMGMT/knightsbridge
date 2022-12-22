import { v4 as uuidv4 } from 'uuid';

import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { StockPairConverter } from '@libs/firebase/converters/stockPairConverter';
import { StockPair } from '@contracts/StockPair';

type InsertStockPairDTO = Omit<StockPair, 'uid' | 'createdAt' | 'updatedAt'>;
type InsertStockPair = (data: InsertStockPairDTO) => Promise<StockPair>;
const insertStockPair: InsertStockPair = async (newStock) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const StockDoc = firestore()
    .collection(FirebaseCollections.STOCK_PAIRS)
    .doc(uid)
    .withConverter(StockPairConverter);

  await StockDoc.set({
    uid,
    ...newStock,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  return StockDoc.get().then((snapshot) => snapshot.data()!);
};

export default insertStockPair;
