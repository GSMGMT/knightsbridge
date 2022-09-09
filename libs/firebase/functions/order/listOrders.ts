import { firestore } from '@libs/firebase/admin-config';

import { FirebaseCollections } from '@libs/firebase/collections';
import { Sort } from '@utils/types';
import { Order } from '@contracts/Order';
import { OrderConverter } from '@libs/firebase/converters/orderConverter';

interface ListOrders {
  size: number;
  sort?: Sort;
  filters?: {
    email?: string;
    userId?: string;
  };
}

const listOrders = async ({
  size,
  sort,
  filters,
}: ListOrders): Promise<Order[]> => {
  let OrderCollection = firestore()
    .collection(FirebaseCollections.ORDERS)
    .orderBy(sort?.field ?? 'createdAt', sort?.orientation ?? 'asc')
    .limit(size)
    .withConverter(OrderConverter);

  if (filters?.email) {
    OrderCollection = OrderCollection.where('user.email', '==', filters.email);
  }

  if (filters?.userId) {
    OrderCollection = OrderCollection.where('user.uid', '==', filters.userId);
  }

  const querySnapshot = await OrderCollection.get();

  const orders: Order[] = [];

  querySnapshot.forEach((doc) => orders.push(doc.data()));

  return orders;
};

export default listOrders;
