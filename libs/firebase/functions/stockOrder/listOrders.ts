import { firestore } from '@libs/firebase/admin-config';

import { FirebaseCollections } from '@libs/firebase/collections';
import { Sort } from '@utils/types';
import { StockOrderConverter } from '@libs/firebase/converters/stockOrderConverter';
import {
  StockOrder,
  StockOrderType,
  StockOrderStatus,
} from '@contracts/StockOrder';

interface ListOrders {
  size: number;
  sort?: Sort;
  filters?: {
    email?: string;
    userId?: string;
    status?: keyof typeof StockOrderStatus;
    type?: StockOrderType;
  };
}

const listOrders = async ({
  size,
  sort,
  filters,
}: ListOrders): Promise<StockOrder[]> => {
  let OrderCollection = firestore()
    .collection(FirebaseCollections.STOCK_ORDERS)
    .orderBy(sort?.field ?? 'createdAt', sort?.orientation ?? 'asc')
    .limit(size)
    .withConverter(StockOrderConverter);

  if (filters?.type) {
    OrderCollection = OrderCollection.where('type', '==', filters.type);
  }

  if (filters?.status) {
    OrderCollection = OrderCollection.where('status', '==', filters.status);
  }

  if (filters?.email) {
    OrderCollection = OrderCollection.where('user.email', '==', filters.email);
  }

  if (filters?.userId) {
    OrderCollection = OrderCollection.where('user.uid', '==', filters.userId);
  }

  const querySnapshot = await OrderCollection.get();

  const orders: StockOrder[] = [];

  querySnapshot.forEach((doc) => orders.push(doc.data()));

  return orders;
};

export default listOrders;
