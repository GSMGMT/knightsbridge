import { v4 as uuidv4 } from 'uuid';

import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { StockExchangeConverter } from '@libs/firebase/converters/stockExchangeConverter';
import { StockExchange } from '@contracts/StockExchange';

interface InsertStockDTO {
  name: string;
  acronym: string;
  mic: string;
  country: string;
  countryCode: string;
}
type InsertStockExchange = (data: InsertStockDTO) => Promise<StockExchange>;
const insertStockExchange: InsertStockExchange = async (newStock) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const StockExchangeDoc = firestore()
    .collection(FirebaseCollections.STOCK_EXCHANGES)
    .doc(uid)
    .withConverter(StockExchangeConverter);

  await StockExchangeDoc.set({
    uid,
    ...newStock,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  return StockExchangeDoc.get().then((snapshot) => snapshot.data()!);
};

export default insertStockExchange;
