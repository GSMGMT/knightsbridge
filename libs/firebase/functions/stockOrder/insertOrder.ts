import { v4 as uuidv4 } from 'uuid';

import { StockOrderStatus } from '@contracts/StockOrder';
import { User } from '@contracts/User';
import { StockPair } from '@contracts/StockPair';
import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/admin-config';
import { StockOrderConverter } from '@libs/firebase/converters/stockOrderConverter';
import { OmitTimestamp } from '@utils/types';

interface InsertOrderDTO {
  type: 'buy' | 'sell';
  user: OmitTimestamp<User>;
  stockPair: OmitTimestamp<StockPair>;
  price: number;
  amount: number;
  total: number;
  fee: number;
}

type InsertOrder = (newOrder: InsertOrderDTO) => Promise<string>;
const insertOrder: InsertOrder = async (newOrder) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const OrderDoc = firestore()
    .collection(FirebaseCollections.STOCK_ORDERS)
    .doc(uid)
    .withConverter(StockOrderConverter);

  await OrderDoc.create({
    uid,
    ...newOrder,
    status: StockOrderStatus.PROCESSING,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  return uid;
};

export default insertOrder;
