import { v4 as uuidv4 } from 'uuid';

import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { StockConverter } from '@libs/firebase/converters/stockConverter';
import { Stock } from '@contracts/Stock';

interface InsertStockDTO {
  name: string;
  symbol: string;
  history: boolean;
}
type InsertStock = (data: InsertStockDTO) => Promise<Stock>;
const insertStock: InsertStock = async (newStock) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const StockDoc = firestore()
    .collection(FirebaseCollections.STOCKS)
    .doc(uid)
    .withConverter(StockConverter);

  await StockDoc.set({
    uid,
    ...newStock,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  return StockDoc.get().then((snapshot) => snapshot.data()!);
};

export default insertStock;
