import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { OrderConverter } from '@libs/firebase/converters/orderConverter';

import { Order } from '@contracts/Order';

export const getOrderByUid = async (uid: string): Promise<Order> => {
  const OrderDocument = firestore()
    .collection(FirebaseCollections.ORDERS)
    .doc(uid)
    .withConverter(OrderConverter);

  const querySnapshot = await OrderDocument.get();

  const order = querySnapshot.data();

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};
