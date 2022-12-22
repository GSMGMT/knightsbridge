import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { StockOrderConverter } from '@libs/firebase/converters/stockOrderConverter';

import { StockOrder } from '@contracts/StockOrder';

export const getOrderByUid = async (uid: string): Promise<StockOrder> => {
  const OrderDocument = firestore()
    .collection(FirebaseCollections.STOCK_ORDERS)
    .doc(uid)
    .withConverter(StockOrderConverter);

  const querySnapshot = await OrderDocument.get();

  const order = querySnapshot.data();

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};
