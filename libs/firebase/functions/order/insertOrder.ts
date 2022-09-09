import { v4 as uuidv4 } from 'uuid';

import { OrderStatus } from '@contracts/Order';
import { User } from '@contracts/User';
import { MarketPair } from '@contracts/MarketPair';
import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/admin-config';
import { OrderConverter } from '@libs/firebase/converters/orderConverter';
import { OmitTimestamp } from '@utils/types';

interface InsertOrder {
  type: 'buy' | 'sell';
  user: OmitTimestamp<User>;
  marketPair: OmitTimestamp<MarketPair>;
  price: number;
  amount: number;
  total: number;
  fee: number;
}

const insertOrder = async (orderUid: string, newOrder: InsertOrder) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const OrderDoc = firestore()
    .collection(FirebaseCollections.ORDERS)
    .doc(orderUid)
    .withConverter(OrderConverter);

  await OrderDoc.set({
    uid,
    ...newOrder,
    status: OrderStatus.PROCESSING,
    createdAt: serverTime,
    updatedAt: serverTime,
  });
};

export default insertOrder;
